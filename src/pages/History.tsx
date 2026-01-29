import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Filter, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Transaction } from '@/types/wallet';

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
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const groups: { [key: string]: Transaction[] } = {};
  
  transactions.forEach((transaction) => {
    const dateKey = transaction.date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
  });

  return groups;
};

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  useEffect(() => {
    setTransactions(storage.getTransactions());
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'in' && (t.type === 'topup' || t.type === 'receive')) ||
      (filter === 'out' && (t.type === 'transfer' || t.type === 'payment'));
    return matchesSearch && matchesFilter;
  });

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Riwayat Transaksi</h1>
        </div>
      </header>

      <main className="relative z-10 space-y-4 px-4 pb-8 pt-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-success/10 p-4">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Pemasukan</span>
            </div>
            <p className="mt-2 text-lg font-bold text-success">
              +{storage.formatCurrency(totalIn)}
            </p>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Pengeluaran</span>
            </div>
            <p className="mt-2 text-lg font-bold text-destructive">
              -{storage.formatCurrency(totalOut)}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full rounded-xl bg-card/50 py-3 pl-10 pr-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-1 rounded-xl bg-card/50 p-1">
            {(['all', 'in', 'out'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'in' ? 'Masuk' : 'Keluar'}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{date}</h3>
              <div className="rounded-2xl bg-card/50 p-2">
                {transactions.map((transaction, index) => {
                  const Icon = getTransactionIcon(transaction.type, transaction.category);
                  const colorClass = getTransactionColor(transaction.type);
                  const isPositive = transaction.amount > 0;

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                      <p className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-foreground'}`}>
                        {isPositive ? '+' : ''}{storage.formatCurrency(transaction.amount)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
