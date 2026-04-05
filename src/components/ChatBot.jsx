import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, ArrowRight } from 'lucide-react';
import './ChatBot.css';

const PREBUILT_QUERIES = [
  { id: 'q1', text: 'How do I add a transaction?', response: 'To add a transaction, switch your Role to "Admin" using the dropdown in the top right corner. Then, go to the Transactions tab and click "Add Transaction".' },
  { id: 'q2', text: 'What is the Insights page?', response: 'The Insights page automatically analyzes your transactions to show your highest spending category, largest single expense, and month-over-month trend!' },
  { id: 'q3', text: 'How is data saved?', response: 'Your data is securely saved in your browser\'s Local Storage, meaning it persists even if you refresh the page.' },
  { id: 'other', text: 'Other query', response: null }
];

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: "Hello! I'm Beru, How can I help you today?",
  type: 'text'
};

const OPTIONS_MESSAGE = {
  id: 2,
  sender: 'bot',
  type: 'options',
  options: PREBUILT_QUERIES
};

const ChatBot = ({ setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE, OPTIONS_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() }]);
  };

  const handleOptionSelect = (option) => {
    // Add user message
    addMessage({ sender: 'user', text: option.text, type: 'text' });

    // Handle bot response with delay simulating typing
    setTimeout(() => {
      if (option.id === 'other') {
        runFallbackResponse();
      } else {
        addMessage({ sender: 'bot', text: option.response, type: 'text' });
        // Show options again after a short delay
        setTimeout(() => {
          addMessage({ sender: 'bot', type: 'options', options: PREBUILT_QUERIES });
        }, 1000);
      }
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage({ sender: 'user', text: inputValue, type: 'text' });
    setInputValue('');

    // Any typed text falls to the fallback response since Beru only knows prebuilt queries
    setTimeout(() => {
      runFallbackResponse();
    }, 600);
  };

  const runFallbackResponse = () => {
    addMessage({ sender: 'bot', text: "Kindly meet our team for more queries.", type: 'action' });
  };

  const navigateToContact = () => {
    setIsOpen(false);
    setActiveTab('contact');
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window fade-in-up">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="bot-titles">
                <span className="bot-name">Beru</span>
                <span className="bot-status">Online</span>
              </div>
            </div>
            <button className="close-chat" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.type === 'text' && (
                  <div className="msg-bubble text-bubble">
                    {msg.text}
                  </div>
                )}

                {msg.type === 'options' && (
                  <div className="options-container">
                    {msg.options.map((opt) => (
                      <button 
                        key={opt.id} 
                        className="option-pill"
                        onClick={() => handleOptionSelect(opt)}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === 'action' && (
                  <div className="msg-bubble action-bubble">
                    <p>{msg.text}</p>
                    <button className="btn-primary action-btn" onClick={navigateToContact}>
                      <span>Meet</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <form onSubmit={handleFormSubmit} className="chat-input-form">
              <input 
                type="text" 
                placeholder="Type your query..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
