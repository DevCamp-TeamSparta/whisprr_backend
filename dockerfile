
    FROM node:20-alpine AS builder


    WORKDIR /home/ubuntu/whisprr_backend
    
    ENV NODE_OPTIONS="--max-old-space-size=4096"
  
    COPY package.json yarn.lock ./
    

    RUN yarn install --frozen-lockfile
    

    COPY . .
    
   
    RUN yarn build
    

    FROM node:20-alpine
    
  
    WORKDIR /home/ubuntu/whisprr_backend
    
    # 환경 변수 최적화
    ENV NODE_ENV=production
    ENV NODE_OPTIONS="--max-old-space-size=4096"
    
   
    COPY --from=builder /home/ubuntu/whisprr_backend/package.json ./
    COPY --from=builder /home/ubuntu/whisprr_backend/yarn.lock ./
    COPY --from=builder /home/ubuntu/whisprr_backend/dist ./dist
    
    RUN yarn install --production --frozen-lockfile
    

    EXPOSE 3000
    
    CMD ["yarn", "start"]
    