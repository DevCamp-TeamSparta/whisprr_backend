FROM node:20-alpine

WORKDIR /home/ubuntu/whisprr_backend

COPY . .
COPY yarn.lock ./

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]