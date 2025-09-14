FROM node:22.12.0-alpine

WORKDIR /app

# Copy package.json và lock file trước
COPY package*.json ./

# Cài dependencies
RUN npm install

# Không copy source code vào đây, vì docker-compose đã mount ./frontend:/app

EXPOSE 5173

CMD ["npm", "run", "dev"]
