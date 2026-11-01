# database/

Its own Docker image (`FROM mongo:7`) + init scripts.

- `init/*.js` run **only once**, when the `mongo-data` volume is empty.
- To re-run them after changing anything: `docker compose down -v` then `docker compose up --build`.
- Demo products and the admin account are still seeded by the backend (`backend/src/seed.js`) because it needs bcrypt.
