FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./

COPY DB/ ./DB/
WORKDIR /usr/src/app/DB
RUN npm install

RUN npx prisma generate
RUN npm run build

WORKDIR /usr/src/app/consumer

COPY consumer/package*.json ./
RUN npm install


COPY consumer/ .

RUN npm run build
CMD ["npm","start"]