import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { QuickActions } from '@/components/wallet/QuickActions';
import { ServiceGrid } from '@/components/wallet/ServiceGrid';
import { TransactionList } from '@/components/wallet/TransactionList';
import { storage } from '@/lib/storage';
import { WalletBalance, Transaction } from '@/types/wallet';

const Index = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setBalance(storage.getBalance());
    setTransactions(storage.getTransactions());
  }, []);

  if (!balance) return null;

  return (
    <MobileLayout title="SmartPay">
      <div className="space-y-6">
        <BalanceCard balance={balance} />
        <QuickActions />
        <ServiceGrid />
        <TransactionList transactions={transactions} limit={5} />
      </div>
    </MobileLayout>
  );
};

export default Index;
