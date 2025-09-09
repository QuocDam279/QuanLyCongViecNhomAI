# Sử dụng Node.js LTS làm base image
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn vào container
COPY . .

# Thiết lập biến môi trường mặc định (có thể override khi chạy)
ENV PORT=5001

# Expose cổng để container lắng nghe
EXPOSE 5001

# Lệnh khởi chạy service
CMD ["node", "server.js"]