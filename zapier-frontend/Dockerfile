FROM node:20-alpine

# Define the argument (passed from docker-compose)
ARG NEXT_PUBLIC_BACKEND_URL
# Convert it to an environment variable for the build command
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /usr/src/app

COPY zapier-frontend/package*.json ./
RUN npm install

COPY zapier-frontend/ .
RUN npm run build

CMD ["npm", "start"]