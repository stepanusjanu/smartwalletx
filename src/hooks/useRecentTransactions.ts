
import { useMemo } from 'react';
import { useWallet } from '@/context/WalletContext';

export function useRecentTransactions(limit = 5) {
  const { transactions, loading, error } = useWallet();

  const recent = useMemo(
    () => transactions.slice(0, limit),
    [transactions, limit]
  );

  return {
    transactions: recent,
    loading,
    error,
  };
}
