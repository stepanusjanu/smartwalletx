import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Bot, User, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';

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

const botResponses: Record<string, string> = {
  'cek saldo saya': `Saldo Anda saat ini adalah ${storage.formatCurrency(storage.getBalance().amount)}. Saldo Anda aman dan terlindungi dengan enkripsi end-to-end.`,
  'riwayat transaksi': 'Anda memiliki 5 transaksi terakhir. Untuk melihat detail lengkap, silakan buka menu Riwayat di halaman utama.',
  'tips keamanan': '🛡️ Tips Keamanan:\n\n1. Jangan bagikan PIN atau OTP kepada siapapun\n2. Aktifkan autentikasi biometrik\n3. Periksa notifikasi transaksi secara berkala\n4. Gunakan jaringan WiFi yang aman\n5. Update aplikasi secara berkala',
  'cara top up': 'Untuk top up saldo:\n\n1. Klik tombol "Top Up" di beranda\n2. Pilih nominal yang diinginkan\n3. Pilih metode pembayaran (E-Wallet/Bank)\n4. Ikuti instruksi pembayaran\n\nProses top up instan dan aman!',
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya asisten AI SmartPay. Ada yang bisa saya bantu hari ini? 🤖\n\nSaya dapat membantu Anda dengan:\n• Informasi saldo dan transaksi\n• Tips keamanan\n• Panduan penggunaan aplikasi\n• Deteksi aktivitas mencurigakan',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const lowercaseContent = content.toLowerCase();
      let response = 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang saldo, transaksi, atau tips keamanan.';

      for (const [key, value] of Object.entries(botResponses)) {
        if (lowercaseContent.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-1/2 top-0 h-full w-full rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AI Assistant</h1>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Security Status */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-xl bg-success/10 p-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">Akun Anda aman</span>
        </div>
        <span className="text-xs text-muted-foreground">AI monitoring aktif</span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-card/80 text-foreground'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.content}</p>
              <p className={`mt-2 text-xs ${message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="whitespace-nowrap rounded-full bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 glass safe-area-bottom p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ketik pesan..."
            className="flex-1 rounded-xl bg-muted/50 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-button disabled:opacity-50"
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
