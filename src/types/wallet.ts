export interface Transaction {
  id: string;
  type: 'topup' | 'transfer' | 'payment' | 'receive';
  source: 'bank' | 'ewallet';
  amount: number;
  description: string;
  category: string;
  date: Date;
  status: 'success' | 'pending' | 'failed';
  icon?: string;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface WalletBalance {
  amount: number;
  currency: string;
  lastUpdated: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  color?: string;
}

export interface EWallet {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface PaymentCategory {
  id: string;
  name: string;
  icon: string;
  route: string;
}
