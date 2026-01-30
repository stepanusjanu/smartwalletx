// Lightweight localStorage-based storage for the e-wallet app
// Simulates SQLite-like persistence without requiring a backend

import { Transaction, WalletBalance } from '@/types/wallet';
import { openDB } from '@/lib/IndexedDB';

const BALANCE_ID = 'main_balance';

// const STORAGE_KEYS = {
//   BALANCE: 'ewallet_balance',
//   TRANSACTIONS: 'ewallet_transactions',
//   USER: 'ewallet_user',
// } as const;

// Initialize with demo data
const INITIAL_BALANCE: WalletBalance = {
  id: BALANCE_ID,
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


type Listener = () => void;

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

// Storage functions
export const storage = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },


  // Balance operations

  // local storage logic for getbalance
  // getBalance: (): WalletBalance => {
  //   try {
  //     const stored = localStorage.getItem(STORAGE_KEYS.BALANCE);
  //     if (stored) {
  //       const parsed = JSON.parse(stored);
  //       return { ...parsed, lastUpdated: new Date(parsed.lastUpdated) };
  //     }
  //     storage.setBalance(INITIAL_BALANCE);
  //     return INITIAL_BALANCE;
  //   } catch {
  //     return INITIAL_BALANCE;
  //   }
  // },
  
  async getBalance(): Promise<WalletBalance> {
    const db = await openDB();
    const tx = db.transaction('balance', 'readonly');
    const store = tx.objectStore('balance');

    return new Promise((resolve) => {
      const req = store.get(BALANCE_ID);

      req.onsuccess = () => {
        if (req.result) {
          resolve({
            ...req.result,
            amount: Number(req.result.amount) || 0,
            lastUpdated: new Date(req.result.lastUpdated),
          });
        } else {
          this.setBalance(INITIAL_BALANCE);
          resolve(INITIAL_BALANCE);
        }
      };
    });
  },
  
  // localstorage logic setbalance
  // setBalance: (balance: WalletBalance): void => {
  //   localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(balance));
  // },
  
 async setBalance(balance: WalletBalance): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('balance', 'readwrite');
    const store = tx.objectStore('balance');

    store.put({
      ...balance,
      id: BALANCE_ID,
      amount: Number(balance.amount) || 0,
      lastUpdated: balance.lastUpdated.toISOString(),
    });

    await tx.complete;
    notify();
  },

  // local storage logic updatebalance
  // updateBalance: (amount: number): WalletBalance => {
  //   const current = storage.getBalance();
  //   const updated: WalletBalance = {
  //     ...current,
  //     amount: current.amount + amount,
  //     lastUpdated: new Date(),
  //   };
  //   storage.setBalance(updated);
  //   return updated;
  // },
  
  async updateBalance(delta: number): Promise<WalletBalance> {
    const current = await this.getBalance();

    const updated: WalletBalance = {
      ...current,
      amount: current.amount + Number(delta),
      lastUpdated: new Date(),
    };

    await this.setBalance(updated);
    return updated;
  },
 
  // Transaction operations
 // localstorage logic on getTransactions
 // getTransactions: (): Transaction[] => {
 //    try {
 //      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
 //      if (stored) {
 //        const parsed = JSON.parse(stored);
 //        return parsed.map((t: Transaction) => ({ ...t, date: new Date(t.date) }));
 //      }
 //      storage.setTransactions(INITIAL_TRANSACTIONS);
 //      return INITIAL_TRANSACTIONS;
 //    } catch {
 //      return INITIAL_TRANSACTIONS;
 //    }
 //  },

  async getTransactions(): Promise<Transaction[]> {
    const db = await openDB();
    const tx = db.transaction('transactions', 'readonly');
    const store = tx.objectStore('transactions');

    return new Promise((resolve) => {
      const req = store.getAll();

      req.onsuccess = () => {
        if (req.result.length) {
          resolve(
            req.result.map((t) => ({
              ...t,
              amount: Number(t.amount) || 0,
              date: new Date(t.date),
            }))
          );
        } else {
          this.setTransactions(INITIAL_TRANSACTIONS);
          resolve(INITIAL_TRANSACTIONS);
        }
      };
    });
  },
 
  // localstorage logic setTransactions
  // setTransactions: (transactions: Transaction[]): void => {
  //   localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  // },
  
  
  async setTransactions(transactions: Transaction[]): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('transactions', 'readwrite');
    const store = tx.objectStore('transactions');

    store.clear();

    transactions.forEach((t) =>
      store.put({
        ...t,
        amount: Number(t.amount) || 0,
        date: t.date.toISOString(),
      })
    );

    await tx.complete;
    notify();
  },

  // localstorage logic addTransaction
  // addTransaction: (transaction: Omit<Transaction, 'id'>): Transaction => {
  //   const transactions = storage.getTransactions();
  //   const newTransaction: Transaction = {
  //     ...transaction,
  //     id: Date.now().toString(),
  //   };
  //   storage.setTransactions([newTransaction, ...transactions]);
  //   return newTransaction;
  // },
  
  
  async addTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Promise<Transaction> {
    const db = await openDB();
    const tx = db.transaction(['transactions', 'balance'], 'readwrite');

    const transactionStore = tx.objectStore('transactions');
    const balanceStore = tx.objectStore('balance');

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      amount: Number(transaction.amount) || 0,
    };

    transactionStore.put({
      ...newTransaction,
      date: newTransaction.date.toISOString(),
    });

    const balanceReq = balanceStore.get(BALANCE_ID);

    balanceReq.onsuccess = () => {
      const current = balanceReq.result ?? INITIAL_BALANCE;

      balanceStore.put({
        ...current,
        amount: Number(current.amount) + newTransaction.amount,
        lastUpdated: new Date().toISOString(),
      });
    };

    await tx.complete;
    notify(); // 👈 THIS IS WHAT TRIGGERS UI UPDATE

    return newTransaction;
  },
  // Utility
  // formatCurrency: (amount: number, currency: string = 'IDR'): string => {
  //   return new Intl.NumberFormat('id-ID', {
  //     style: 'currency',
  //     currency,
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(Math.abs(amount));
  // },
  
  formatCurrency(amount: number, currency = 'IDR'): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(Number(amount) || 0));
  },


  // localstorage clear all storage keys 
  // clearAll: (): void => {
  //   Object.values(STORAGE_KEYS).forEach((key) => {
  //     localStorage.removeItem(key);
  //   });
  // },
  
  async clearAll(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(['balance', 'transactions', 'user'], 'readwrite');

    tx.objectStore('balance').clear();
    tx.objectStore('transactions').clear();
    tx.objectStore('user').clear();

    await tx.complete;
  },
};
