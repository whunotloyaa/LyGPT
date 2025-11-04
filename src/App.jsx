import React, { useState } from "react";
import Author from "./Author";

export default function App() {
  const [messages, setMessages] = useState([
    { from: "ly", text: "Salut — je suis LyGPT. Pose-moi une question !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(m => [...m, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      const reply = data.reply || "Désolé, pas de réponse.";
      setMessages(m => [...m, { from: "ly", text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { from: "ly", text: "Erreur serveur. Réessaie plus tard." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>LyGPT</h1>
        <div className="hdr-actions">
          <button onClick={() => setShowAuthor(s => !s)} className="btn">Auteur</button>
        </div>
      </header>

      {showAuthor ? (
        <Author />
      ) : (
        <>
          <main className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from === "user" ? "user" : "ly"}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && <div className="msg ly"><div className="bubble">...</div></div>}
          </main>

          <footer className="composer">
            <input
              placeholder="Tape ta question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
            />
            <button onClick={send} className="send">Envoyer</button>
          </footer>
        </>
      )}
      <div className="nebula-bg"></div>
    </div>
  );
}
