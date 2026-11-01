
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# /app
# │
# ├── package.json
# └── package-lock.json
RUN npm ci
COPY . .
# /app/
# │
# ├── Dockerfile
# ├── package.json
# ├── package-lock.json
# ├── vite.config.js
# ├── index.html
# │
# ├── node_modules/
# │
# │
# └── src/
#     ├── assets/
#     ├── components/
#     ├── pages/
#     ├── App.jsx
#     ├── main.jsx
#     └── ...
RUN npm run build


FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80