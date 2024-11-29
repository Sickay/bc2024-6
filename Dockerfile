# Використовуємо офіційний образ Node.js
FROM node:16

# Створюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь проект у робочу директорію контейнера
COPY . .

# Встановлюємо nodemon для автоматичного перезавантаження (лише для розробки)
RUN npm install -g nodemon

# Виставляємо порт для роботи
EXPOSE 3000

# Команда для запуску сервера в режимі розробки з nodemon
CMD ["nodemon", "main.js"]
