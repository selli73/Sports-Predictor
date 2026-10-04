# Sports Predictor — frontend

Vite + React + TypeScript, состояние — MobX, запросы — axios, роутинг — react-router-dom.

## Запуск

1. Поднять базу и Redis: `docker compose up -d` (из корня проекта)
2. Запустить backend: `cd backend && bun run start:dev` (порт 3000)
3. Запустить frontend:

```bash
cd frontend
bun install
bun run dev
```

Приложение откроется на http://localhost:5173.

## Как frontend ходит в backend

Backend не включает CORS, поэтому все запросы идут на `/api/...`, а dev-сервер Vite
проксирует их на `http://localhost:3000` (см. `vite.config.ts`). Префикс `/api` при этом отрезается:
`/api/user/login` → `http://localhost:3000/user/login`.

Базовый URL можно переопределить переменной `VITE_API_BACKEND_URL` (см. `.env.example`).
Для production нужен такой же reverse-proxy (например, nginx) с `/api` на backend.

## Структура

```
src/
  components/   страницы и компоненты (папка на каждый раздел, рядом свой .css)
  http/         axios-инстанс, подстановка токена, разбор ошибок backend
  models/       TypeScript-интерфейсы ответов backend
  services/     запросы к API (по одному классу на модуль backend)
  store/        MobX-сторы, создаются в main.tsx и раздаются через Context
  styles/       дизайн-токены и общие стили
  utils/        форматирование дат, вероятностей, подписи исходов
```

## Страницы

| Путь | Что делает | Endpoint backend |
|---|---|---|
| `/login`, `/register` | вход и регистрация | `POST /user/login`, `POST /user/register` |
| `/recovery-password` | восстановление пароля в 3 шага | `POST /user/forgot-password`, `/user/reset-code-verification`, `/user/reset-password` |
| `/matches` | ближайшие матчи, AI-вероятности, прогноз П1/Х/П2 | `GET /match/upcoming`, `POST /predictions/createPrediction` |
| `/predictions` | мои прогнозы, статистика и начисленные очки | `GET /predictions/my` |
| `/leaderboard` | топ-10 игроков | `GET /leaderboard` |
| `/profile` | данные аккаунта, смена пароля | `GET /profile/me`, `PATCH /user/change-password` |
| `/admin` | ручной запуск импорта, Gemini и начисления очков (только ADMIN) | `POST /football/*`, `/gemini/ai-probability`, `/points/add` |
