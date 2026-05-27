# AssessAI — AI Assessment Creator

A production-grade full-stack application that generates structured academic question papers using AI, with real-time WebSocket updates and queue-based processing.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/WS    ┌─────────────────┐
│   Next.js 15    │ ◄───────────► │   Express.js    │
│   Frontend      │               │   Backend       │
└─────────────────┘               └────────┬────────┘
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                         ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
                         │ MongoDB │ │  Redis  │ │ BullMQ  │
                         └─────────┘ └─────────┘ └────┬────┘
                                                       │
                                               ┌───────▼───────┐
                                               │  AI Worker    │
                                               │ (Groq/OpenAI) │
                                               └───────────────┘
```

## 📁 Folder Structure

```
ai-assessment-creator/
├── backend/
│   └── src/
│       ├── config/          # DB, Redis connections
│       ├── controllers/     # Request handlers
│       ├── middleware/       # Error handling, auth
│       ├── models/          # Mongoose schemas
│       ├── queues/          # BullMQ queue setup
│       ├── routes/          # Express routes
│       ├── services/        # AI generation service
│       ├── sockets/         # Socket.io setup & emitters
│       ├── types/           # TypeScript interfaces
│       ├── utils/           # Logger
│       ├── workers/         # BullMQ workers
│       └── index.ts         # Entry point
│
└── frontend/
    ├── app/                 # Next.js App Router
    │   ├── page.tsx         # Landing page
    │   ├── create/          # Create assignment page
    │   └── assignments/     # List & detail pages
    ├── components/
    │   └── assignment/      # Form, Output, Processing components
    ├── hooks/               # useAssignmentSocket
    ├── lib/                 # PDF generator
    ├── services/            # API & Socket services
    ├── store/               # Zustand store
    └── types/               # TypeScript types
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Groq API key (free at console.groq.com) OR OpenAI API key

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-assessment
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=gsk_your_groq_key_here
AI_PROVIDER=groq
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Environment

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

### 4. Start Services

**Option A: Start MongoDB & Redis locally**

```bash
# macOS with Homebrew
brew services start mongodb-community
brew services start redis

# Ubuntu
sudo systemctl start mongod
sudo systemctl start redis-server
```

**Option B: Docker**

```bash
docker run -d -p 27017:27017 mongo:7
docker run -d -p 6379:6379 redis:alpine
```

### 5. Run the Application

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 — BullMQ Worker:**
```bash
cd backend
npm run worker
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔄 Application Flow

1. User fills assignment form on `/create`
2. Frontend sends `POST /api/v1/assignments` with form data
3. Backend validates, saves to MongoDB with `status: "pending"`
4. Backend adds BullMQ job to `assignment-generation` queue
5. Frontend redirects to `/assignments/:id`, joins WebSocket room
6. Worker picks up job:
   - Emits `assignment-processing` → frontend shows processing state
   - Builds AI prompt with assignment details
   - Calls Groq/OpenAI API
   - Parses & validates JSON response
   - Saves `generatedPaper` to MongoDB, updates `status: "completed"`
   - Caches in Redis (1hr TTL)
   - Emits `assignment-completed` with full data
7. Frontend receives WebSocket event → updates UI automatically

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assignments` | List all assignments |
| POST | `/api/v1/assignments` | Create new assignment |
| GET | `/api/v1/assignments/:id` | Get assignment by ID |
| POST | `/api/v1/assignments/:id/regenerate` | Regenerate paper |
| GET | `/health` | Health check |

## 🔌 WebSocket Events

**Server → Client:**
- `assignment-processing` — Job started
- `assignment-completed` — Paper ready with data
- `assignment-failed` — Error with message

**Client → Server:**
- `join-assignment` — Join room for an assignment
- `leave-assignment` — Leave room

## 🤖 AI Providers

Set `AI_PROVIDER` in backend `.env`:
- `groq` — Uses Llama3-70B (fast, free tier available)
- `openai` — Uses GPT-4o-mini (higher quality, paid)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| State | Zustand |
| HTTP Client | Axios |
| Real-time | Socket.io-client |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Cache | Redis (ioredis) |
| Queue | BullMQ |
| AI | Groq SDK / OpenAI SDK |
| PDF | jsPDF + jsPDF-AutoTable |

## 📝 Notes

- The worker runs as a **separate process** — both `npm run dev` and `npm run worker` must be running
- Redis is required for BullMQ; the API server will warn but continue without it
- AI responses are fully parsed and validated before storage — raw LLM output is never rendered
- Redis caches completed assignments for 1 hour to reduce DB reads
