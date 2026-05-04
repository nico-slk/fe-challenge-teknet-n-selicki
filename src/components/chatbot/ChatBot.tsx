import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../../hooks/useChat';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const { messages, sendMessage, loading } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const messageToSend = input;
    setInput('');

    await sendMessage(messageToSend);
  };

  return (
    <>
      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? '✖' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Asistente IA</h3>
          </div>

          <div className="chatbot-messages">
            <div className="message assistant">
              ¡Hola! Soy tu asistente de seguros. ¿En qué puedo ayudarte hoy?
            </div>

            {messages.map((msg, index: number) => (
              <div key={index} className={`message ${msg.role}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>

                {msg.mode === 'rule-based' && (
                  <small className="mode-badge">⚠️ Modo básico (sin IA)</small>
                )}
              </div>
            ))}

            {loading && <div className="message assistant typing">Analizando datos...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder={loading ? "Esperando respuesta..." : "Pregunta sobre tus pólizas..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
