FROM node:20-alpine

WORKDIR /home/ubuntu/whisprr_backend

COPY . .
COPY package.json yarn.lock ./

RUN yarn install --production
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]