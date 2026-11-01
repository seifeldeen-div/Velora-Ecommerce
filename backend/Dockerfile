FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# /app
# │
# ├── package.json
# └── package-lock.json

RUN npm ci --omit=dev

COPY src ./src

# /app/
# │
# ├── package.json
# ├── package-lock.json
# │
# └── src/
#     ├── server.js
#     ├── routes/
#     └── controllers/

EXPOSE 5000

CMD ["npm", "start"]
