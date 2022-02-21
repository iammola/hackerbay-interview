FROM node:lts-alpine AS build

WORKDIR /usr/src/app
COPY package*.json* .

RUN npm install --silent
COPY . .

RUN npm run build

# ---

FROM node:lts-alpine AS start

ENV PORT 8125
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json* .

RUN npm install --production --silent
COPY --from=build /usr/src/app/build build

EXPOSE 8125

RUN chown -R node /usr/src/app
USER node

CMD ["npm", "start"]
