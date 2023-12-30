# Use an official node runtime as a parent image
FROM node:21-alpine

RUN mkdir /app
WORKDIR /app

# copy all dependencies
COPY package*.json ./
RUN npm install

# copy all files in the working dir
COPY . .

CMD ["npm", "run", "dev"]