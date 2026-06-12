FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY DB/ ./DB/
WORKDIR /usr/src/app/DB
RUN npm install

RUN npx prisma generate
RUN npm run build

WORKDIR /usr/src/app/hooks

COPY hooks/package*.json ./
RUN npm install


COPY hooks/ .

RUN npm run build

EXPOSE 3001

CMD ["npm" , "start"]
