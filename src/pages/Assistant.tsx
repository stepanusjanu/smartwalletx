
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Bot, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useWallet } from '@/context/WalletContext';
import { useRecentTransactions } from '@/hooks/useRecentTransactions';
import { useAssistant } from '@/hooks/useAssistant';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  'Cek saldo saya',
  'Riwayat transaksi',
  'Tips keamanan',
  'Cara top up',
];

export default function Assistant() {
  const { balance } = useWallet();
  const { transactions } = useRecentTransactions(5);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        'Halo! Saya asisten AI SmartPay 🤖\n\nSaya dapat membantu Anda dengan:\n• Informasi saldo\n• Riwayat transaksi\n• Tips keamanan\n• Panduan penggunaan',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const response = useAssistant(
        content,
        balance,
        transactions
      );

      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

 return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/" className="rounded-lg p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" />
                Online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Security */}
      <div className="mx-4 mt-3 rounded-xl bg-success/15 px-3 py-2 text-xs text-success flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Akun Anda aman — monitoring aktif
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"> {/* FIX */}
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.type === 'user'
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-muted/70 text-foreground'
                }
              `}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              <p className="mt-1 text-[10px] opacity-60 text-right">
                {msg.timestamp.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="border-t border-border/40 bg-background/80 px-4 py-3"> {/* FIX */}
        <div className="flex gap-2 overflow-x-auto">
          {quickReplies.map(reply => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="rounded-full bg-muted/60 px-4 py-2 text-sm font-medium hover:bg-muted transition"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-border/40 bg-background/80 backdrop-blur px-4 py-3"> {/* FIX */}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ketik pesan..."
            className="h-12 flex-1 rounded-xl bg-muted/50 px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary disabled:opacity-50"
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
 
