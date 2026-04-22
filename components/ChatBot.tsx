import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { useStore } from '../context/StoreContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, t, user, orders, products } = useStore();
  const [chatSession, setChatSession] = useState<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Init chat session once
  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const catalogInfo = products.map(p => `- ${p.name_en || p.name_bn}: ${p.price} BDT (Stock: ${p.stock > 0 ? 'Available' : 'Out of Stock'})`).join('\n').substring(0, 5000); // Truncate just in case
        
        const userOrders = user 
          ? orders.filter(o => o.userId === user.id).map(o => `- Order #${o.id.substring(0, 6)}: Status is ${o.status}, Total: ${o.finalTotal} BDT`).join('\n')
          : 'User is not logged in or has no recent orders.';

        const systemInstruction = `
You are a helpful customer support agent for NUR, a premium e-commerce store in Bangladesh.
Be concise, polite, and responsive in both Bengali and English based on the user's language. Use emojis warmly.

STORE POLICIES:
- Delivery charge: Inside Dhaka 60 BDT (2-3 days), Outside Dhaka 120 BDT (3-5 days). Free shipping on select items.
- Return Policy: 7 days easy return if the product is defective.
- Payment Methods: Cash on Delivery (COD), bKash, SSLCommerz.
- Wholesale: Minimum order quantity applies. We offer tiered pricing.

USER CONTEXT:
${user ? `Name: ${user.name}, Email: ${user.email}` : 'Guest User'}

USER ORDERS:
${userOrders}
(If a user asks about their order, use the above info. If they are an anonymous Guest, tell them to log in to track their orders.)

PRODUCT CATALOG (Available Items):
${catalogInfo.length > 0 ? catalogInfo : 'Catalog is loading...'}

INSTRUCTIONS:
1. Answer questions based ONLY on the catalog and policies provided.
2. Provide short, concise answers.
3. If a product isn't in the catalog list, say it's not currently available or you can't find it.
4. If a user wants to buy something, guide them to use the search bar or navigate to the Shop page.
`;

        const chat = ai.chats.create({
          model: 'gemini-3.1-pro-preview',
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Keep it grounded
          }
        });
        setChatSession(chat);
        setMessages([{ role: 'model', text: 'Hello! Welcome to NUR support. 👋 How can I help you today with your orders or finding products?' }]);
      } catch (e) {
        console.error("Chat initialization error", e);
      }
    }
  }, [isOpen, chatSession, products, user, orders]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;
    
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const responseStream = await chatSession.sendMessageStream({ message: userText });
      
      // Add empty message placeholder
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of responseStream) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk.text;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-accent text-primary p-4 rounded-full shadow-xl hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Support Chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-darkBorder bg-white dark:bg-darkCard transition-all">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-accent" />
              <div>
                <h3 className="font-bold text-sm">NUR Support</h3>
                <p className="text-[10px] text-gray-300">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-80 bg-gray-50 dark:bg-darkBg/50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'} items-end gap-2`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-primary'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-darkCard dark:text-gray-200 border border-gray-100 dark:border-darkBorder shadow-sm rounded-bl-none'}`}>
                  {msg.role === 'model' ? (
                    <div className="markdown-body text-[13px] leading-relaxed max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start flex max-w-[85%] items-end gap-2">
                 <div className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center shrink-0">
                  <Bot size={12} />
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-darkCard border border-gray-100 dark:border-darkBorder shadow-sm rounded-bl-none">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-darkCard border-t border-gray-100 dark:border-darkBorder flex items-center gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-darkBorder dark:bg-darkBg dark:text-white text-sm focus:outline-none focus:border-primary"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-full bg-primary text-white disabled:opacity-50 hover:bg-blue-900 transition-colors"
            >
              <Send size={16} className={input.trim() ? "translate-x-[1px] translate-y-[-1px]" : ""} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
