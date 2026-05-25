# AI Chatbot Platform — Backend

Production-ready, multi-brand AI chatbot backend built with **Node.js**, **Express**, **Socket.io**, **MongoDB**, **Kafka**, and **Redis**.

## Architecture Overview

```
Frontend (Web / Widget)
        │
        ▼
   Socket.io Gateway  ──►  Redis (sessions, typing, cache)
        │
        ▼
   Kafka Producer (chat_messages)
        │
        ▼
   AI Workflow Engine (Kafka Consumer)
        │
        ▼
   Kafka Producer (bot_responses)
        │
        ▼
   Socket.io Emit ──►  Frontend
```

### Tech Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| API          | Express.js        |
| Real-time    | Socket.io         |
| Database     | MongoDB + Mongoose|
| Events       | Apache Kafka      |
| Cache        | Redis (ioredis)   |
| Auth         | JWT               |
| Logging      | Winston           |
| Security     | Helmet, CORS, rate limit, sanitization |

## Project Structure

```
backend/
├── src/
│   ├── config/          # db, kafka, redis, socket, env
│   ├── modules/         # auth, brand, chatbot, conversation, message, workflow, analytics, kafka, websocket
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── utils/
│   ├── constants/
│   ├── validators/
│   └── app.js
├── server.js
├── docker-compose.yml
└── package.json
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)

### 2. Environment

```bash
cp .env.example .env
# Edit JWT secrets and connection strings
```

### 3. Start Infrastructure

```bash
docker compose up -d mongo redis zookeeper kafka
```

### 4. Install & Run API

```bash
npm install
npm run dev
```

### 5. Start Kafka Consumers (separate terminal)

```bash
npm run kafka:consumers
```

API: `http://localhost:3000`  
Health: `GET /api/v1/health`

## REST API

Base path: `/api/v1`

### Auth

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| POST   | `/auth/signup`     | Register user  |
| POST   | `/auth/login`      | Login          |
| POST   | `/auth/refresh`    | Refresh tokens |

### Brand

| Method | Endpoint                    | Auth |
| ------ | --------------------------- | ---- |
| POST   | `/brands`                   | Yes  |
| PATCH  | `/brands/:brandId`          | Yes  |
| GET    | `/brands/:brandId/config`   | Yes  |

### Chatbot

| Method | Endpoint                         | Auth |
| ------ | -------------------------------- | ---- |
| POST   | `/chatbots`                      | Yes  |
| PATCH  | `/chatbots/:brandId`             | Yes  |
| GET    | `/chatbots/:brandId`             | Yes  |
| PATCH  | `/chatbots/:brandId/ai-config`   | Yes  |

### Conversation

| Method | Endpoint                                      | Auth |
| ------ | --------------------------------------------- | ---- |
| GET    | `/conversations/brand/:brandId?userId=`       | Yes  |
| GET    | `/conversations/:conversationId/messages`     | Yes  |
| DELETE | `/conversations/:conversationId`              | Yes  |

### Workflow

| Method | Endpoint                        | Auth |
| ------ | ------------------------------- | ---- |
| POST   | `/workflows`                    | Yes  |
| PATCH  | `/workflows/:workflowId`        | Yes  |
| GET    | `/workflows/brand/:brandId`     | Yes  |

## Socket.io Events

Connect with auth token in handshake:

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_ACCESS_TOKEN', userId: 'user001' },
});
```

### Client → Server

| Event             | Description              |
| ----------------- | ------------------------ |
| `JOIN_BRAND_ROOM` | Join `brand:{brandId}`   |
| `SEND_MESSAGE`    | Send user message        |
| `USER_TYPING`     | Typing indicator           |

### Server → Client

| Event             | Description           |
| ----------------- | --------------------- |
| `RECEIVE_MESSAGE` | Bot/user message      |
| `BOT_TYPING`      | Bot typing state      |
| `USER_TYPING`     | User typing state     |
| `ERROR`           | Error payload         |

### Message Payload Example

```json
{
  "event": "SEND_MESSAGE",
  "brandId": "674a1b2c3d4e5f6789012345",
  "conversationId": "674a1b2c3d4e5f6789012346",
  "userId": "user001",
  "message": {
    "text": "Suggest running shoes",
    "type": "text"
  },
  "metadata": {
    "timestamp": "2026-05-25T10:00:00.000Z",
    "platform": "web"
  }
}
```

## Kafka Topics

| Topic              | Purpose                    |
| ------------------ | -------------------------- |
| `chat_messages`    | Incoming user messages     |
| `bot_responses`    | AI/workflow responses      |
| `typing_events`    | Typing indicators          |
| `analytics_events` | Usage analytics            |
| `workflow_events`  | Workflow execution events  |

## Workflow Engine

Node-based executor with types:

- `input` → `intent` → `memory` → `prompt` → `ai` → `response`

Extend `workflow.executor.js` to plug in OpenAI, Anthropic, RAG, or vector DB.

## Multi-Brand Example

1. Signup → Login
2. `POST /brands` — create Nike, Zara, etc.
3. `POST /chatbots` — per-brand AI config & theme
4. `POST /workflows` — per-brand conversation flow
5. Frontend joins `brand:{brandId}` room via Socket.io

## Docker (Full Stack)

```bash
docker compose up --build
```

Runs API + Kafka consumers + MongoDB + Redis + Kafka.

## Future Scalability

This layout supports:

- Kubernetes deployments (API vs consumer pods)
- Microservice extraction (auth, chat, workflow, analytics)
- RAG + vector DB via `ai` workflow node
- WhatsApp/webhook channel adapters
- Multi-tenant SaaS with brand isolation

## License

MIT
