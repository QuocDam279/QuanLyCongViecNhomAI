FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV TZ=Asia/Ho_Chi_Minh
COPY . .
EXPOSE 5008
CMD ["node", "server.js"]