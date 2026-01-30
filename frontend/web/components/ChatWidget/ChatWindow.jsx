import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import '../../styles/chat.css';

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, send, loading } = useChat('guest-123'); // Hardcoded ID for demo

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Savoria Sommelier</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble message-${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="message-bubble message-ai">Typing...</div>}
          </div>
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
            />
            <button className="chat-send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
