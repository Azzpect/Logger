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


FROM node:latest


COPY --from=builder /server /server
COPY --from=builder /app/build /server/web

WORKDIR /server

RUN npm install --production

CMD ["npm", "run", "prod"]
