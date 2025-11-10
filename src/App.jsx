import React, { useState } from "react";
import Author from "./Author";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("accessGranted") === "true");
  const [accessKey, setAccessKey] = useState("");
  const [messages, setMessages] = useState([
    { from: "ly", text: "Salut — je suis LyGPT. Pose-moi une question !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);
  const [chats, setChats] = useState([{ id: 0, messages: [] }]);
  const [currentChat, setCurrentChat] = useState(0);

  const VALID_KEY = "290108"; // 🔐 Clé fixe d’accès

  // Connexion
  function handleLogin() {
    if (accessKey.trim() === VALID_KEY) {
      localStorage.setItem("accessGranted", "true");
      setIsLoggedIn(true);
    } else {
      alert("❌ Clé invalide. Essaie encore !");
    }
  }

  // Déconnexion
  function handleLogout() {
    localStorage.removeItem("accessGranted");
    setIsLoggedIn(false);
    setAccessKey("");
  }

  // Création d’un nouveau chat
  function newChat() {
    const newChatId = chats.length;
    setChats([...chats, { id: newChatId, messages: [] }]);
    setCurrentChat(newChatId);
    setMessages([]);
  }

  // Envoi du message
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

  // Si non connecté → afficher écran de connexion
  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <h2>🔐 Connexion à LyGPT</h2>
        <p>Entre la clé d’accès pour continuer :</p>
        <input
          type="password"
          placeholder="Clé d’accès"
          value={accessKey}
          onChange={e => setAccessKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="app">
      <header className="topbar">
        <h1>LyGPT</h1>
        <div className="hdr-actions">
          <button onClick={newChat} className="btn">+ Nouveau chat</button>
          <button onClick={() => setShowAuthor(s => !s)} className="btn">Auteur</button>
          <button onClick={handleLogout} className="btn">Déconnexion</button>
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
