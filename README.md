# Health-Checker-AI

A privacy-first health tracking application with local AI (Ollama + Llama 3.2) for pattern detection and health summaries.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Zustand
- **Backend**: Express.js, Node.js 18+
- **Database**: PostgreSQL 15+, Prisma ORM
- **AI**: Ollama with Llama 3.2 (runs locally at http://localhost:11434)

## Prerequisites

- Node.js 18+
- [Docker](https://docs.docker.com/get-docker/) (for PostgreSQL + Ollama) — or install them manually

## Setup

### Option A: Quick start with Docker (recommended for sharing)

Your friend can run everything using your shared `.env`:

```bash
# 1. Copy the shared .env (or cp .env.example .env)
cp .env.example .env   # or use the .env file shared with you

# 2. Start PostgreSQL + Ollama
docker compose up -d

# 3. Pull the AI model (first time only)
docker exec -it healthtrack-ollama ollama pull llama3.2

# 4. Install deps and run migrations
npm install
npm run db:push

# 5. Start the app
npm run dev
```

- **PostgreSQL** runs at `localhost:5432` (credentials from `.env`)
- **Ollama** runs at `localhost:11434` (same `.env`)

**Sharing with your team:** Share your `.env` file (or have them copy `.env.example`). PostgreSQL and Ollama configs are all env-driven, so it works on any PC with Docker.

### Option B: Manual install (PostgreSQL + Ollama on host)

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your Postgres credentials (or the Docker Postgres vars).

#### 3. Create database

```bash
createdb healthtrack
npm run db:push
```

#### 4. Install Ollama (optional, for AI features)

1. Install Ollama: https://ollama.ai
2. `ollama pull llama3.2` and run `ollama serve`

## Development

Start both API and frontend:

```bash
npm run dev
```

- **API**: http://localhost:4000
- **Frontend**: http://localhost:3000

Or run separately:

```bash
npm run dev:api   # API only
npm run dev:web   # Frontend only
```

## Project Structure

```
practice/
├── apps/
│   ├── api/           # Express backend
│   │   ├── prisma/    # Schema & migrations
│   │   └── src/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   └── web/           # Next.js frontend
│       └── src/
│           ├── app/   # Pages (App Router)
│           ├── components/
│           ├── lib/
│           └── store/
├── .env
└── package.json
```

## Features

- **User auth**: Register, login, JWT
- **Symptom tracking**: Log, view, filter, analytics
- **Medications**: Add, schedule, adherence tracking
- **Doctor visits**: Log visits, link symptoms
- **Lifestyle**: Sleep, mood, exercise, diet
- **AI (Ollama)**:
  - Pattern recognition (symptom-medication, symptom-lifestyle)
  - Appointment preparation summaries
  - Medical summaries for doctors
  - Disease detection (symptoms → possible conditions via Ollama)
  - Natural language Q&A over your health data

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/symptoms` - List symptoms
- `POST /api/symptoms` - Create symptom
- `GET /api/medications` - List medications
- `POST /api/medications` - Add medication
- `GET /api/visits` - List doctor visits
- `POST /api/visits` - Log visit
- `GET /api/lifestyle` - Lifestyle logs
- `POST /api/ai/chat` - AI chat
- `POST /api/ai/patterns` - Pattern analysis
- `POST /api/ai/appointment-prep` - Appointment prep
- `POST /api/ai/medical-summary` - Medical summary
- `POST /api/ai/disease-detection` - Disease detection (symptoms → possible conditions)

See the PRD for the full API specification.
