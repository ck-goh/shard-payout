FROM node:9.2

RUN mkdir /src
WORKDIR src
COPY package*.json /src/
RUN npm install
COPY src /src/src
COPY SWGoH_Shard.xlsx /src
CMD ["npm", "start"]

