
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/storage';
import { WalletBalance, Transaction } from '@/types/wallet';

interface WalletState {
  balance: WalletBalance | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const cacheRef = useRef<WalletState | null>(null);
  const [state, setState] = useState<WalletState>({
    balance: null,
    transactions: [],
    loading: true,
    error: null,
  });

  async function load() {
    try {
      const [rawBalance, rawTransactions] = await Promise.all([
        storage.getBalance(),
        storage.getTransactions(),
      ]);

      const normalizedTransactions = Array.isArray(rawTransactions)
        ? rawTransactions
          .map(t => ({
          ...t,
            amount: Number(t.amount) || 0,
            date: new Date(t.date),
            startedAt: t.startedAt ? new Date(t.startedAt) : undefined,
            finishedAt: t.finishedAt ? new Date(t.finishedAt) : undefined,
          }))
          .sort((a, b) => {
            const aTime = a.finishedAt ?? a.startedAt ?? a.date;
            const bTime = b.finishedAt ?? b.startedAt ?? b.date;
            return bTime.getTime() - aTime.getTime();
          })
      : [];
     
      const nextState: WalletState = {
        balance: rawBalance
          ? {
              ...rawBalance,
              amount: Number(rawBalance.amount) || 0,
              lastUpdated: new Date(rawBalance.lastUpdated),
            }
          : null,
        transactions: normalizedTransactions,
        loading: false,
        error: null,
      };

      cacheRef.current = nextState;
      setState(nextState);
    } catch {
      setState({
        balance: null,
        transactions: [],
        loading: false,
        error: 'Failed to load wallet data',
      });
    }
  }

  useEffect(() => {
    load();
    const unsubscribe = storage.subscribe?.(load);
    return () => unsubscribe?.();
  }, []);

  return (
    <WalletContext.Provider value={cacheRef.current ?? state}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used inside WalletProvider');
  }
  return ctx;
}


