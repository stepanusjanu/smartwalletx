import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Smartphone, Zap, CreditCard } from 'lucide-react';
import { Transaction } from '@/types/wallet';
import { storage } from '@/lib/storage';
import { Link } from 'react-router-dom';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const getTransactionIcon = (type: Transaction['type'], category: string) => {
  if (category === 'Pulsa') return Smartphone;
  if (category === 'Listrik') return Zap;
  if (type === 'transfer' || type === 'payment') return ArrowUpRight;
  return ArrowDownLeft;
};

const getTransactionColor = (type: Transaction['type']) => {
  switch (type) {
    case 'topup':
    case 'receive':
      return 'text-success bg-success/20';
    case 'transfer':
    case 'payment':
      return 'text-destructive bg-destructive/20';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export const TransactionList = ({ transactions, limit }: TransactionListProps) => {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="rounded-2xl bg-card/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Transaksi Terakhir</h3>
        <Link to="/history" className="text-xs font-medium text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>
      
      <div className="space-y-3">
        {displayedTransactions.map((transaction, index) => {
          const Icon = getTransactionIcon(transaction.type, transaction.category);
          const colorClass = getTransactionColor(transaction.type);
          const isPositive = transaction.amount > 0;

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/30"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
              <p className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-foreground'}`}>
                {isPositive ? '+' : ''}{storage.formatCurrency(transaction.amount)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
