FROM node:14.18

WORKDIR /app

COPY package*.json /app

RUN npm install
RUN npm install -g nodemon


COPY . .

CMD npm start


