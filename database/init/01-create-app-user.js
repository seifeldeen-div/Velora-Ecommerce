// Runs once on first start (empty volume only).
// Creates a limited user for the backend, so the API never uses the root account.
const dbName = process.env.MONGO_DB;
const appUser = process.env.MONGO_APP_USER;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!dbName || !appUser || !appPassword) {
  throw new Error("MONGO_DB, MONGO_APP_USER and MONGO_APP_PASSWORD must be set");
}

const appDb = db.getSiblingDB(dbName);

appDb.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: dbName }],
});

print(`Created user "${appUser}" with readWrite access on "${dbName}"`);
