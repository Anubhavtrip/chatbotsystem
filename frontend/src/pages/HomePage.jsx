export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-chat-border/60 bg-chat-surface px-4 py-1.5 text-xs text-chat-muted">
        <span className="h-2 w-2 rounded-full bg-chat-success" />
        Production-ready AI Chat Widget
      </div>
      <h1 className="mb-4 bg-gradient-to-br from-white to-chat-muted bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
        AI Support Assistant
      </h1>
      <p className="mb-8 max-w-lg text-base leading-relaxed text-chat-muted sm:text-lg">
        Modern ChatGPT-style floating widget built with React, Redux Toolkit,
        Socket.io, and Tailwind. Click the chat button in the bottom-right to
        start a conversation.
      </p>
      <div className="grid w-full max-w-md gap-3 text-left sm:grid-cols-2">
        {[
          { title: 'Redux Toolkit', desc: 'Slices, thunks, selectors' },
          { title: 'WebSocket', desc: 'Real-time with reconnect' },
          { title: 'REST API', desc: 'Axios layer + mock AI' },
          { title: 'Scalable', desc: 'Ready for Kafka + AI backend' },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-chat-border/40 bg-chat-surface/80 p-4 shadow-lg backdrop-blur"
          >
            <h3 className="text-sm font-semibold text-chat-text">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-chat-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default HomePage;
