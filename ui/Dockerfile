
FROM node:13.12.0-alpine

COPY . /app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["node", "server/index.js"]
