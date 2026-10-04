![](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs&logoColor=white)
![](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![](https://img.shields.io/badge/-Redis-DC382D?logo=Redis&logoColor=FFF)
![](https://img.shields.io/badge/Puppeteer-powered-blue?style=flat-square&logo=google-chrome)
![](https://img.shields.io/badge/Google%20Gemini-8E75B2?logo=googlegemini&logoColor=white)
![](https://img.shields.io/badge/-Swagger-85EA2D?style=flat&logo=swagger&logoColor=white)
![](https://shields.io/badge/-react-4377cb?logo=react)
![](https://img.shields.io/badge/-Vite-B73BFE?style=flat&logo=vite&logoColor=white)
![](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white)

# Sports Predictor — прогнозы на футбольные матчи

Платформа для прогнозов на футбольные матчи. Пользователь выбирает исход ближайшего матча — победа хозяев, ничья или победа гостей, — а после финального свистка получает очки за верный прогноз и соревнуется с другими игроками в рейтинге. Для каждого матча нейросеть Google Gemini рассчитывает вероятность исходов, на которую можно ориентироваться.

---

## :page_facing_up: Содержание

- [Sports Predictor — прогнозы на футбольные матчи](#sports-predictor--прогнозы-на-футбольные-матчи)
  - [:page\_facing\_up: Содержание](#page_facing_up-содержание)
  - [:pencil: О проекте](#pencil-о-проекте)
  - [:boom: Возможности](#boom-возможности)
    - [:lock: Аккаунты](#lock-аккаунты)
    - [:soccer: Матчи и прогнозы](#soccer-матчи-и-прогнозы)
    - [:robot: ИИ-прогноз исходов](#robot-ии-прогноз-исходов)
    - [:trophy: Очки и рейтинг](#trophy-очки-и-рейтинг)
    - [:spider\_web: Сбор данных](#spider_web-сбор-данных)
    - [:hammer\_and\_wrench: Администрирование](#hammer_and_wrench-администрирование)
  - [:wrench: Технологии](#wrench-технологии)
  - [:rocket: Установка и запуск](#rocket-установка-и-запуск)
    - [Требования](#требования)
    - [Как запустить проект](#как-запустить-проект)
  - [:green\_book: Документация API](#green_book-документация-api)
  - [:notebook: Переменные окружения](#notebook-переменные-окружения)
    - [`Sports-Predictor/.env`](#sports-predictorenv)
    - [`backend/.env`](#backendenv)
    - [`frontend/.env`](#frontendenv)
  - [:bust\_in\_silhouette: Итого](#bust_in_silhouette-итого)

## :pencil: О проекте

***Sports Predictor*** — full-stack приложение, которое само собирает расписание и результаты матчей, считает вероятности исходов с помощью ИИ и автоматически начисляет очки игрокам.

Как это работает:

1. Backend через headless-браузер **Puppeteer** забирает с **Flashscore** расписание матчей австралийской лиги **NPL ACT** и сохраняет их в базу.
2. Для предстоящих матчей статистика побед, ничьих и поражений команд отправляется в **Google Gemini**, и нейросеть возвращает вероятность каждого исхода.
3. Пользователи делают прогнозы: П1, Х или П2. Прогноз можно сделать только до начала матча, и изменить его нельзя.
4. Каждые 10 минут backend забирает результаты завершённых матчей, начисляет очки за угаданные исходы и обновляет рейтинг.

Подробное описание backend-части: [Notion](https://app.notion.com/p/2-388ce807cb8380bfb140f4d33468deaa?source=copy_link)

---

## :boom: Возможности

### :lock: Аккаунты
- Регистрация и авторизация по JWT (токен живёт 1 день), хеширование паролей через bcrypt
- Приветственное письмо после регистрации
- Восстановление пароля по коду из письма: код действует 15 минут
- Смена пароля в личном кабинете
- Роли `USER` и `ADMIN` — административные эндпоинты закрыты guard'ом по роли

### :soccer: Матчи и прогнозы
- Лента ближайших матчей с постраничной подгрузкой
- Карточка матча: команды, дата, шкала вероятностей от ИИ и составы, если они есть в базе
- Прогноз на исход: П1 / Х / П2 — один на матч, только до его начала, без возможности изменить
- Страница «Мои прогнозы»: счёт, статус матча, результат прогноза и полученные очки, фильтр «Ожидают / Завершены»
- Личная статистика: количество прогнозов, угаданные исходы, точность и сумма очков

### :robot: ИИ-прогноз исходов
- Для каждого предстоящего матча Gemini получает статистику обеих команд: победы, ничьи, поражения
- Результат сохраняется в базу: вероятность победы хозяев, ничьей и победы гостей
- На frontend вероятности показываются цветной шкалой и в процентах

### :trophy: Очки и рейтинг
- **10 очков** за каждый угаданный исход
- Начисление выполняется в транзакции, матч помечается как рассчитанный — очки не начисляются дважды
- Топ-10 игроков с подсветкой текущего пользователя
- Рейтинг кэшируется в **Redis** на час и сбрасывается при каждом начислении очков

### :spider_web: Сбор данных

| Задача | Расписание | Что делает |
|--------|------------|------------|
| Импорт предстоящих матчей | каждый день в 00:00 | парсит расписание NPL ACT с Flashscore, создаёт команды и матчи |
| Импорт результатов | каждые 10 минут | сохраняет счёт, серию пенальти и исход, переводит матч в статус «Завершён» |
| Начисление очков | каждые 10 минут | начисляет очки за угаданные исходы по завершённым матчам |
| Расчёт вероятностей (Gemini) | вручную | отправляет предстоящие матчи в Gemini и сохраняет вероятности |

### :hammer_and_wrench: Администрирование
- Страница `/admin` видна только пользователям с ролью `ADMIN`
- Ручной запуск любой задачи из таблицы выше, не дожидаясь расписания

---

## :wrench: Технологии

**Backend**
- **NestJS** + **TypeScript**
- **PostgreSQL** + **Prisma ORM** — пользователи, команды, игроки, матчи и прогнозы
- **Redis** — кэш рейтинга
- **@nestjs/schedule** — фоновые задачи по cron
- **Puppeteer** + **Cheerio** — парсинг расписания и результатов матчей
- **Google Gemini API** — расчёт вероятностей исходов
- **JWT** + **Passport** + **bcrypt** — авторизация и безопасное хранение паролей
- **Nodemailer** — письма при регистрации и коды восстановления пароля
- **class-validator** — валидация входящих данных
- **Swagger** — автодокументация API

**Frontend**
- **React** + **TypeScript** + **Vite**
- **MobX** — управление состоянием
- **Axios** — запросы к API
- **React Router** — маршрутизация

**Инфраструктура**
- **Docker** + **Docker Compose** — PostgreSQL и Redis

---

## :rocket: Установка и запуск

### Требования

- [Bun](https://bun.sh/)
- Docker и Docker Compose
- Google Chrome — Puppeteer запускает его по пути `C:\Program Files\Google\Chrome\Application\chrome.exe` (задан в `backend/src/football/football.service.ts`)

### Как запустить проект

**1. Клонируйте репозиторий:**
```bash
# Клонировать репозиторий
git clone https://github.com/selli73/Sports-Predictor.git

# Перейти в папку проекта
cd Sports-Predictor

cd backend
# Установить зависимости backend
bun install

cd ..

cd frontend
# Установить зависимости frontend
bun install
```

**2. Создайте файлы окружения**

Все `.env` перечислены в `.gitignore`, поэтому после клонирования их нужно создать самому по примеру `.env.example`.

```bash
# В корне проекта — для Docker Compose
cp .env.example .env

# Для backend
cp backend/.env.example backend/.env

# Для frontend
cp frontend/.env.example frontend/.env
```

Откройте `backend/.env` и обязательно поправьте строку подключения — логин, пароль и имя базы должны совпадать с корневым `.env`:

```env
DATABASE_URL="postgresql://postgres:secret@localhost:5432/sports_predictor?schema=public"
```

В `frontend/.env` укажите адрес backend — обязательно вместе с `http://`:

```env
VITE_API_BACKEND_URL=http://localhost:3000
```

Описание всех переменных — в разделе [Переменные окружения](#notebook-переменные-окружения).

**3. Создайте файл user.constants.ts**

*Положите этот файл в backend/src/user/user.constants.ts*

```TypeScript
export const jwtToken = {
    secret: 'example-secret'
};
```
Этот файл нужен для подписи JWT-токенов.

**4. Поднимите PostgreSQL и Redis**

```bash
docker compose up -d
```

**5. Примените миграции**

```bash
cd backend

bunx prisma migrate deploy

bunx prisma generate
```

**6. Запустите backend**

```bash
cd backend

bun run start:dev
```

Backend запустится на `http://localhost:3000`.

**7. Запустите frontend**

```bash
cd frontend

bun run dev
```

Приложение откроется на `http://localhost:5173`.


## :green_book: Документация API

После запуска проекта документация Swagger доступна по адресу:
`http://localhost:3000/api/docs`


## :notebook: Переменные окружения

### `Sports-Predictor/.env`

| Переменная          |  Назначение                         |
| ------------------- | ----------------------------------- |
|`DB_NAME`            | Название базы данных в контейнере   |
|`DB_USER`            | Имя пользователя БД                 |
|`DB_PASSWORD`        | Пароль PostgreSQL                   |

### `backend/.env`

| Переменная                          |  Назначение                                          |
| ----------------------------------- | ---------------------------------------------------- |
|`DATABASE_URL`                       | Строка подключения к PostgreSQL                      |
|`SMTP_HOST`                          | SMTP-сервер, например `smtp.gmail.com`               |
|`SMTP_PORT`                          | Порт SMTP-сервера, например `587`                    |
|`SMTP_EMAIL`                         | Адрес, с которого отправляются письма                |
|`SMTP_PASSWORD`                      | **Пароль приложения** почты (для Gmail)              |
|`URL_NPL_ACT_UPCOMING_MATCHES_2026`  | Страница Flashscore с расписанием NPL ACT            |
|`URL_NPL_ACT_RESULT_2026`            | Страница Flashscore с результатами NPL ACT           |
|`GEMINI_API_KEY`                     | Ключ Google Gemini API                               |
|`PROMPT_GEMINI`                      | Промпт для Gemini, к нему дописывается JSON с матчами |
|`PORT`                               | Порт backend, необязательно (по умолчанию `3000`)    |


### `frontend/.env`

| Переменная              |  Назначение                                     |
| ----------------------- | ----------------------------------------------- |
|`VITE_API_BACKEND_URL`   | Адрес backend вместе с `http://`, например `http://localhost:3000` |


## :bust_in_silhouette: Итого

Этот проект я создал, чтобы на практике собрать full-stack приложение вокруг
внешних данных: расписание и результаты матчей
приходится забирать headless-браузером с чужого сайта, а прогнозы — получать
от нейросети.