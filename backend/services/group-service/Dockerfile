# Sử dụng Node.js LTS
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json trước
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường mặc định
ENV PORT=5002

# Expose cổng
EXPOSE 5002

# Lệnh khởi chạy
CMD ["node", "server.js"]