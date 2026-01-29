import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { WalletBalance } from '@/types/wallet';
import { storage } from '@/lib/storage';

interface BalanceCardProps {
  balance: WalletBalance;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-6 glass-card glow-primary"
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-primary opacity-30 blur-2xl" />
      <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-secondary/30 blur-xl" />

      {/* Security indicator */}
      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-1">
        <Shield className="h-3.5 w-3.5 text-success" />
        <span className="text-xs font-medium text-success">Secured</span>
      </div>

      {/* Balance content */}
      <div className="relative z-10">
        <p className="text-sm text-muted-foreground">Total Saldo</p>
        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isHidden ? '••••••••' : storage.formatCurrency(balance.amount, balance.currency)}
          </h2>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="rounded-full p-1.5 transition-colors hover:bg-muted/50"
          >
            {isHidden ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
          <span className="text-xs text-muted-foreground">bulan ini</span>
        </div>
      </div>
    </motion.div>
  );
};
