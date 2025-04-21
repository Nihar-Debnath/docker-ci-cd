FROM oven/bun:1

WORKDIR /user/src/app

COPY ./packages ./packages
COPY ./bun.lock ./bun.lock

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./turbo.json ./turbo.json

COPY ./apps/ws ./apps/ws

RUN bun pm cache clean
RUN bun install
RUN apt-get update -y && apt-get install -y openssl
RUN bun run db:generate

EXPOSE 8081

CMD ["bun", "run", "start:ws"]