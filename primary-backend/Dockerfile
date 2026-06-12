FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./

COPY DB/ ./DB/

WORKDIR /usr/src/app/DB
RUN npm install

RUN npx prisma generate
RUN npm run build

WORKDIR /usr/src/app/primary-backend

COPY primary-backend/package*.json ./
RUN npm install

COPY primary-backend/ .

RUN npm run build

EXPOSE 5000

CMD ["npm","start"]
