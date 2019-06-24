#FROM node:9.2
FROM node:12.4

RUN mkdir /src
WORKDIR src
COPY package*.json /src/
RUN npm install
COPY src /src/src
CMD ["npm", "start"]

