import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BalanceCard } from '@/components/wallet/BalanceCard'; 
import { QuickActions } from '@/components/wallet/QuickActions';
import { ServiceGrid } from '@/components/wallet/ServiceGrid';
import { TransactionList } from '@/components/wallet/TransactionList';
import { storage } from '@/lib/storage'; 
import { WalletBalance, Transaction } from '@/types/wallet';
import { useWallet } from '@/context/WalletContext';
import { useRecentTransactions } from '@/hooks/useRecentTransactions';

const Index = () => {
  const { balance, loading, error } = useWallet();
  const { transactions } = useRecentTransactions(5);

  if (loading) return null;
  if (error) return <div>{error}</div>;
  if (!balance) return null;

  return (
    <MobileLayout title="SmartPay">
      <div className="space-y-6">
        <BalanceCard balance={balance} />
        <QuickActions />
        <ServiceGrid />
        <TransactionList transactions={transactions} />
      </div>
    </MobileLayout>
  );
};

export default Index;
