import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBudget = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: 'user', text: inputValue.trim() }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Ok, entiendo. ¿Podrías darme más detalles sobre las dimensiones?' }]);
      }, 1000);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-strong rounded-2xl p-4 border border-neon-cyan/20">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-neon-cyan text-dark-950'
                    : 'glass border border-white/10 text-white'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu respuesta..."
          className="flex-1 px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
        />
        <button
          onClick={handleSendMessage}
          className="w-12 h-12 bg-neon-cyan rounded-xl flex items-center justify-center text-dark-950 font-bold hover:opacity-90 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBudget;
