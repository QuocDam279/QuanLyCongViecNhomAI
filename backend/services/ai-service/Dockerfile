# Base image
FROM node:18

# Tạo thư mục app
WORKDIR /app

# Copy file cấu hình
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng
EXPOSE 5006

# Chạy server
CMD ["node", "server.js"]