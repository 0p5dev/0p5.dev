FROM oven/bun:1.3-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1.3-alpine AS production
WORKDIR /app
COPY --from=build /app/.output .output
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT [ "bun" ]
CMD [ ".output/server/index.mjs" ]