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

<a id="sports-predictor--football-match-predictions"></a>

# Sports Predictor: football match predictions

Predict the outcome of a football match: a home win, a draw, or an away win. Correct predictions earn points once the match ends and count toward your place on the leaderboard. Each match also has outcome probabilities estimated by Google Gemini.

<a id="page_facing_up-table-of-contents"></a>

## Contents

- [Sports Predictor: football match predictions](#sports-predictor--football-match-predictions)
  - [Contents](#page_facing_up-table-of-contents)
  - [How it works](#pencil-about-the-project)
  - [Features](#boom-features)
    - [Accounts](#lock-accounts)
    - [Matches and predictions](#soccer-matches-and-predictions)
    - [Gemini probabilities](#robot-ai-outcome-predictions)
    - [Points and leaderboard](#trophy-points-and-leaderboard)
    - [Data collection](#spider_web-data-collection)
    - [Administration](#hammer_and_wrench-administration)
  - [Technologies](#wrench-technologies)
  - [Local setup](#rocket-installation-and-setup)
    - [Requirements](#requirements)
    - [How to run the project](#how-to-run-the-project)
  - [API documentation](#green_book-api-documentation)
  - [Environment variables](#notebook-environment-variables)
    - [`Sports-Predictor/.env`](#sports-predictorenv)
    - [`backend/.env`](#backendenv)
    - [`frontend/.env`](#frontendenv)
  - [Why I built it](#bust_in_silhouette-summary)

<a id="pencil-about-the-project"></a>

## How it works

1. The backend fetches Australia's NPL ACT league schedule from Flashscore using Puppeteer, which runs a headless browser, and saves it to the database.
2. Google Gemini receives each team's win, draw, and loss statistics for upcoming matches and returns the probability of each outcome.
3. Users submit predictions: 1, X, or 2. Predictions can only be submitted before kickoff and cannot be changed.
4. Every 10 minutes, the backend fetches completed match results, awards points for correct predictions, and updates the leaderboard.

<a id="boom-features"></a>

## Features

<a id="lock-accounts"></a>

### Accounts

Users can register, sign in, and change their password from their account. Authentication uses JWT tokens that expire after 1 day; bcrypt hashes passwords. A role-based guard restricts administrative endpoints according to the `USER` and `ADMIN` roles.

Registration sends a welcome email. Password recovery uses an emailed code that stays valid for 15 minutes.

<a id="soccer-matches-and-predictions"></a>

### Matches and predictions

The upcoming match feed loads in pages. Each card shows the teams, date, and AI probability bar, plus lineups when they are available in the database. You can submit one prediction per match (1 / X / 2) before kickoff. Once submitted, it cannot be changed.

The "My Predictions" page shows the score, match status, prediction result, and points earned, with a "Pending / Completed" filter. Personal statistics track your prediction count, correct outcomes, accuracy, and total points.

<a id="robot-ai-outcome-predictions"></a>

### Gemini probabilities

For each upcoming match, Gemini uses both teams' wins, draws, and losses to estimate the chances of a home win, a draw, and an away win. The backend saves these probabilities to the database, and the frontend displays them as percentages and a colored bar.

<a id="trophy-points-and-leaderboard"></a>

### Points and leaderboard

Each correct prediction earns 10 points. Awarding points and marking a match as scored happen in the same transaction to prevent duplicate awards.

The leaderboard lists the top 10 players and highlights the current user. Redis caches it for one hour; awarding points invalidates the cache.

<a id="spider_web-data-collection"></a>

### Data collection

| Task | Schedule | What it does |
|--------|------------|------------|
| Import upcoming matches | Daily at 00:00 | Parses the NPL ACT schedule from Flashscore and creates teams and matches |
| Import results | Every 10 minutes | Saves the score, penalty shootout, and outcome, and sets the match status to "Completed" |
| Award points | Every 10 minutes | Awards points for correct outcome predictions on completed matches |
| Calculate probabilities (Gemini) | Manually | Sends upcoming matches to Gemini and saves the probabilities |

<a id="hammer_and_wrench-administration"></a>

### Administration

The `/admin` page is visible only to users with the `ADMIN` role. It lets administrators run any of the tasks above manually, without waiting for the next scheduled run.

<a id="wrench-technologies"></a>

## Technologies

### Backend

- NestJS + TypeScript
- PostgreSQL + Prisma ORM for users, teams, players, matches, and predictions
- Redis for the leaderboard cache
- @nestjs/schedule for cron-based background tasks
- Puppeteer + Cheerio for scraping match schedules and results
- Google Gemini API for outcome probabilities
- JWT + Passport + bcrypt for authentication and secure password storage
- Nodemailer for registration emails and password recovery codes
- class-validator for input validation
- Swagger for automatic API documentation

### Frontend

- React + TypeScript + Vite
- MobX for state management
- Axios for API requests
- React Router for routing

### Infrastructure

Docker Compose runs PostgreSQL and Redis in Docker containers.

<a id="rocket-installation-and-setup"></a>

## Local setup

### Requirements

- [Bun](https://bun.sh/)
- Docker and Docker Compose
- Google Chrome. Puppeteer launches it from `C:\Program Files\Google\Chrome\Application\chrome.exe` (configured in `backend/src/football/football.service.ts`)

### How to run the project

#### 1. Clone the repository and install dependencies
```bash
# Clone the repository
git clone https://github.com/selli73/Sports-Predictor.git

# Navigate to the project directory
cd Sports-Predictor

cd backend
# Install backend dependencies
bun install

cd ..

cd frontend
# Install frontend dependencies
bun install
```

#### 2. Create the environment files

The `.env` files are excluded by `.gitignore`. Copy the `.env.example` templates to create them:

```bash
# In the project root — for Docker Compose
cp .env.example .env

# For the backend
cp backend/.env.example backend/.env

# For the frontend
cp frontend/.env.example frontend/.env
```

In `backend/.env`, set the connection string to match the username, password, and database name in the root `.env`:

```env
DATABASE_URL="postgresql://postgres:secret@localhost:5432/sports_predictor?schema=public"
```

Set the backend address in `frontend/.env`, including `http://`:

```env
VITE_API_BACKEND_URL=http://localhost:3000
```

See [Environment variables](#notebook-environment-variables) for the full list.

#### 3. Create the user.constants.ts file

Save the following in backend/src/user/user.constants.ts to configure the JWT signing secret:

```TypeScript
export const jwtToken = {
    secret: 'example-secret'
};
```

#### 4. Start PostgreSQL and Redis

```bash
docker compose up -d
```

#### 5. Apply migrations

```bash
cd backend

bunx prisma migrate deploy

bunx prisma generate
```

#### 6. Start the backend

```bash
cd backend

bun run start:dev
```

The backend runs at `http://localhost:3000`.

#### 7. Start the frontend

```bash
cd frontend

bun run dev
```

Open the application at `http://localhost:5173`.


<a id="green_book-api-documentation"></a>

## API documentation

With the backend running, open Swagger at
`http://localhost:3000/api/docs`


<a id="notebook-environment-variables"></a>

## Environment variables

### `Sports-Predictor/.env`

| Variable            | Purpose                             |
| ------------------- | ----------------------------------- |
|`DB_NAME`            | Database name in the container      |
|`DB_USER`            | Database username                   |
|`DB_PASSWORD`        | PostgreSQL password                 |

### `backend/.env`

| Variable                            | Purpose                                              |
| ----------------------------------- | ---------------------------------------------------- |
|`DATABASE_URL`                       | PostgreSQL connection string                         |
|`SMTP_HOST`                          | SMTP server, e.g. `smtp.gmail.com`                    |
|`SMTP_PORT`                          | SMTP server port, e.g. `587`                          |
|`SMTP_EMAIL`                         | Sender email address                                 |
|`SMTP_PASSWORD`                      | Email app password (for Gmail)                        |
|`URL_NPL_ACT_UPCOMING_MATCHES_2026`  | Flashscore page with the NPL ACT schedule             |
|`URL_NPL_ACT_RESULT_2026`            | Flashscore page with NPL ACT results                  |
|`GEMINI_API_KEY`                     | Google Gemini API key                                |
|`PROMPT_GEMINI`                      | Gemini prompt, with match data appended as JSON       |
|`PORT`                               | Backend port, optional (defaults to `3000`)           |


### `frontend/.env`

| Variable                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
|`VITE_API_BACKEND_URL`   | Backend address including `http://`, e.g. `http://localhost:3000` |


<a id="bust_in_silhouette-summary"></a>

## Why I built it

I built this project to practice full-stack development with external data. It uses a headless browser to fetch match schedules and results from a third-party website, and an AI model to estimate outcomes.
