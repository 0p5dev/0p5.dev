FROM docker.io/library/node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM docker.io/library/node:24-alpine AS production
WORKDIR /app
COPY --from=build /app/.output .output
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ ".output/server/index.mjs" ]
