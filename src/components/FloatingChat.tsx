import { useState } from 'react';
import AIChatbot from '../pages/AIChatbot';
import './FloatingChat.css';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`floating-chat-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Mở trợ lý AI"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="floating-chat-window">
          <div className="chat-window-header">
            <h3>🤖 Trợ Lý AI</h3>
            <button 
              className="close-chat-button"
              onClick={toggleChat}
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>
          <div className="chat-window-content">
            <AIChatbot isFloatingMode={true} />
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && <div className="chat-overlay" onClick={toggleChat} />}
    </>
  );
};

export default FloatingChat;
