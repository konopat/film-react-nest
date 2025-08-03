FROM node:18-alpine as build

WORKDIR /app

# Добавляем ARG для переменных окружения
ARG VITE_API_URL
ARG VITE_CDN_URL

# Устанавливаем переменные окружения для сборки
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем директорию для SSL сертификатов
RUN mkdir -p /etc/nginx/ssl

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"] 