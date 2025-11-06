# build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build


# serve stage
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# optional: expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]