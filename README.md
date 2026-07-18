# Store

Интернет-магазин с каталогом товаров, корзиной, оформлением доставки (дата, временной слот, точка на карте), отзывами и авторизацией пользователей.

Монорепозиторий из двух приложений:

- **`backend/`** — REST API на [NestJS](https://nestjs.com/) 11 + [Prisma](https://www.prisma.io/) 7 + PostgreSQL.
- **`frontend/`** — SSR-приложение на [Nuxt](https://nuxt.com/) 4 (Vue 3) + Tailwind CSS 4 + [shadcn-vue](https://www.shadcn-vue.com/).

## Технологии

| Слой      | Стек                                                                       |
| --------- | -------------------------------------------------------------------------- |
| Backend   | NestJS 11, Prisma 7 (`@prisma/adapter-pg`), PostgreSQL, JWT, bcryptjs      |
| Frontend  | Nuxt 4, Vue 3, Tailwind CSS 4, shadcn-vue / reka-ui, VueUse, Leaflet       |
| Язык      | TypeScript                                                                 |
| Пакетный менеджер | pnpm                                                                |

## Возможности

- Каталог товаров с категориями и карточками товара
- Корзина (открывается автоматически при добавлении первого товара)
- Оформление заказа: адрес с выбором точки на карте (Leaflet), дата и временной слот доставки
- Отзывы и рейтинги товаров
- Регистрация и вход по email/паролю (JWT), заказы доступны и гостям
- Тёмная/светлая тема, русскоязычный интерфейс

## Структура

```
store/
├── backend/     # NestJS API — модули auth, categories, products, orders, reviews
│   ├── src/
│   ├── prisma/  # schema.prisma, миграции, seed
│   └── ...
└── frontend/    # Nuxt-приложение (страницы, компоненты, API-клиент)
    └── app/
```

## Требования

- Node.js 20+
- pnpm
- PostgreSQL

## Запуск

### Backend

```bash
cd backend
pnpm install

# создайте .env (см. переменные ниже), затем примените схему БД
pnpm prisma migrate dev
pnpm prisma db seed          # опционально: наполнить демо-данными

pnpm start:dev               # http://localhost:3001, префикс /api
```

Переменные окружения (`backend/.env`):

| Переменная      | Назначение                                              | По умолчанию                                             |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`  | Строка подключения к PostgreSQL                         | —                                                        |
| `PORT`          | Порт API                                                | `3001`                                                   |
| `CORS_ORIGINS`  | Разрешённые origin'ы (через запятую)                    | `http://localhost:5173,http://localhost:3000,http://localhost:3002` |
| `JWT_SECRET`    | Секрет для подписи JWT                                  | —                                                        |

Статические изображения товаров раздаются из `backend/public/images` по пути `/images`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev                     # http://localhost:3002
```

Переменные окружения (`frontend/.env`):

| Переменная                     | Назначение                                              | По умолчанию                    |
| ------------------------------ | ------------------------------------------------------- | ------------------------------- |
| `NUXT_PUBLIC_API_BASE_URL`     | URL API для браузера и SSR                              | `http://localhost:3001/api`     |
| `NUXT_API_BASE_URL`            | Внутренний URL API для SSR (если отличается)            | (не задан)                      |

## API

Базовый префикс — `/api`.

| Метод  | Путь                | Описание                          |
| ------ | ------------------- | --------------------------------- |
| `POST` | `/auth/register`    | Регистрация                       |
| `POST` | `/auth/login`       | Вход, выдача JWT                   |
| `GET`  | `/auth/me`          | Текущий пользователь              |
| `GET`  | `/categories`       | Список категорий                  |
| `GET`  | `/products`         | Список товаров                    |
| `GET`  | `/products/:id`     | Товар по id                       |
| `POST` | `/orders`           | Создать заказ                     |
| `GET`  | `/orders`           | Список заказов                    |
| `POST` | `/reviews`          | Добавить отзыв                    |

## Сборка

```bash
# Backend
cd backend && pnpm build && pnpm start:prod

# Frontend
cd frontend && pnpm build && pnpm preview
```

Для обоих приложений есть `Dockerfile`.
