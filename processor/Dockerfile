FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./

COPY DB/ ./DB/
WORKDIR /usr/src/app/DB
RUN npm install

RUN npx prisma generate
RUN npm run build

WORKDIR /usr/src/app/processor

COPY processor/package*.json ./
RUN npm install

COPY processor/ .

RUN npm run build
CMD ["npm","start"]


