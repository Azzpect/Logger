FROM node:latest AS builder


COPY . /

WORKDIR /app

RUN npm install
RUN npm run build


WORKDIR /server

RUN npm install
RUN npm run build
RUN rm -rf src
RUN rm -rf node_modules 
RUN rm dist/*.ts
RUN rm dist/*.ts.map
RUN rm dist/*.js.map
RUN mv dist app

FROM node:latest


COPY --from=builder /server /logger
COPY --from=builder /app/build /logger/web

WORKDIR /logger

ENV PORT=6571
EXPOSE 6571

RUN npm install --production

CMD ["node", "app/index.js"]
