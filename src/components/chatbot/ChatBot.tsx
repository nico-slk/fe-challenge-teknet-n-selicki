import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de seguros. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Recibí tu mensaje: "${userMsg.content}". Próximamente podré analizar tus pólizas.`
      }]);
      setIsTyping(false);
    }, 1500);
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
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && <div className="message assistant typing">Escribiendo...</div>}
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Pregunta sobre tus pólizas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
