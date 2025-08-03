# FILM!

Веб-приложение для бронирования билетов в кинотеатр.

## Задеплоенное приложение

**Ссылка на приложение:** https://konopat.nomorepartiessbs.ru

**API:** https://konopat.nomorepartiessbs.ru/api/afisha

**PgAdmin:** https://konopat.nomorepartiessbs.ru:8080

## Установка

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `postgres` 
* `DATABASE_HOST` - адрес СУБД PostgreSQL, например `localhost`
* `DATABASE_PORT` - порт PostgreSQL, например `5432`
* `DATABASE_USERNAME` - имя пользователя, например `postgres`
* `DATABASE_PASSWORD` - пароль пользователя
* `DATABASE_NAME` - имя базы данных, например `films`

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

### Frontend

Перейдите в папку с исходным кодом фронтенда

`cd frontend`

Установите зависимости:

`npm ci`

Запустите фронтенд:

`npm run dev`

### Docker

Для запуска через Docker:

```bash
docker-compose up -d --build
```

## Тестирование

```bash
# Backend тесты
cd backend
npm test

# Frontend тесты
cd frontend
npm test
```

## Деплой

Приложение автоматически деплоится на сервер при пуше в ветку `review-2` или `develop`.

CI/CD Pipeline включает:
1. Тестирование
2. Сборка Docker образов
3. Публикация в GitHub Container Registry
4. Автоматический деплой на сервер

SSL сертификат настроен автоматически через Let's Encrypt.
