# AI Chatbot Frontend

Production-ready AI chatbot widget built with **React + Vite + JavaScript**, styled like modern support assistants (ChatGPT, Intercom, Crisp).

## Tech Stack

- React 19 + Vite 8
- Redux Toolkit (slices, async thunks, selectors)
- Tailwind CSS v4
- Socket.io-client (with mock mode for local dev)
- Axios (interceptors, error normalization)
- React Router DOM

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click the floating chat button.

## Project Structure

```
src/
├── app/                 # App shell & providers
├── components/
│   ├── chat/            # Chat UI components
│   └── common/          # Shared UI (Loader)
├── features/chat/       # Redux slice, API, selectors
├── hooks/               # useChat, useSocket, useAutoScroll
├── layouts/             # MainLayout with widget
├── pages/               # HomePage
├── routes/              # React Router config
├── services/            # axios, socket
├── store/               # configureStore
├── constants/
├── utils/
└── styles/
```

## Environment

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | REST API base URL |
| `VITE_SOCKET_URL` | Socket.io server URL |
| `VITE_USE_MOCK_API` | Use mock REST responses |
| `VITE_USE_MOCK_SOCKET` | Use in-browser mock socket |

Set both mock flags to `false` when connecting to a real backend.

## Backend Integration (Kafka + AI)

1. **WebSocket** — Emit `chat:send` / listen for `chat:message`, `chat:typing:start`, `chat:typing:stop` (see `src/constants/index.js`).
2. **REST** — `POST /api/chat/message`, `GET /api/chat/history` (see `src/features/chat/chatAPI.js`).
3. Disable mock env vars and point URLs to your gateway service.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- Floating widget with open/close animation
- User & bot message bubbles with timestamps
- Typing indicator & loading states
- Message status (sending, sent, failed)
- Online indicator
- Empty state with quick suggestions
- Enter to send, Shift+Enter for newline
- Session persistence via `localStorage`
- Auto-scroll on new messages
