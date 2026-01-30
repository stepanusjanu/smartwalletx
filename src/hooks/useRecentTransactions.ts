
import { useMemo } from 'react';
import { useWallet } from '@/context/WalletContext';

export function useRecentTransactions(limit = 5) {
  const { transactions, loading, error } = useWallet();
  const recent = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
       )
    .slice(0, limit);
  }, [transactions, limit]);
  return {
    transactions: recent,
    loading,
    error,
  };
}
