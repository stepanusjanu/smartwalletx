// Lightweight localStorage-based storage for the e-wallet app
// Simulates SQLite-like persistence without requiring a backend

import { Transaction, WalletBalance } from '@/types/wallet';

const STORAGE_KEYS = {
  BALANCE: 'ewallet_balance',
  TRANSACTIONS: 'ewallet_transactions',
  USER: 'ewallet_user',
} as const;

// Initialize with demo data
const INITIAL_BALANCE: WalletBalance = {
  amount: 2500000,
  currency: 'IDR',
  lastUpdated: new Date(),
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'topup',
    amount: 500000,
    description: 'Top Up via BCA',
    category: 'Top Up',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'success',
  },
  {
    id: '2',
    type: 'payment',
    amount: -50000,
    description: 'Pulsa Telkomsel',
    category: 'Pulsa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'success',
  },
  {
    id: '3',
    type: 'transfer',
    amount: -150000,
    description: 'Transfer ke John Doe',
    category: 'Transfer',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'success',
  },
  {
    id: '4',
    type: 'payment',
    amount: -275000,
    description: 'Token Listrik PLN',
    category: 'Listrik',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'success',
  },
  {
    id: '5',
    type: 'receive',
    amount: 100000,
    description: 'Dari Sarah',
    category: 'Receive',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96),
    status: 'success',
  },
];

// Storage functions
export const storage = {
  // Balance operations
  getBalance: (): WalletBalance => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BALANCE);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...parsed, lastUpdated: new Date(parsed.lastUpdated) };
      }
      storage.setBalance(INITIAL_BALANCE);
      return INITIAL_BALANCE;
    } catch {
      return INITIAL_BALANCE;
    }
  },

  setBalance: (balance: WalletBalance): void => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(balance));
  },

  updateBalance: (amount: number): WalletBalance => {
    const current = storage.getBalance();
    const updated: WalletBalance = {
      ...current,
      amount: current.amount + amount,
      lastUpdated: new Date(),
    };
    storage.setBalance(updated);
    return updated;
  },

  // Transaction operations
  getTransactions: (): Transaction[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((t: Transaction) => ({ ...t, date: new Date(t.date) }));
      }
      storage.setTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  setTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Omit<Transaction, 'id'>): Transaction => {
    const transactions = storage.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    storage.setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  },

  // Utility
  formatCurrency: (amount: number, currency: string = 'IDR'): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};
