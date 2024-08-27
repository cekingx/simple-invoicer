# Stage 1: Build Nestjs app
FROM node:18.19.0 AS builder

WORKDIR /usr/app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2: Run Nestjs app
FROM node:18.19.0 AS runner

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/views ./views
COPY --from=builder /usr/app/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]
