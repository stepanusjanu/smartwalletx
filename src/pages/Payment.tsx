import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Zap, Droplets, Wifi, Gamepad2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

const paymentTypes: Record<string, { label: string; icon: typeof Smartphone; placeholder: string; amounts: number[] }> = {
  pulsa: {
    label: 'Pulsa',
    icon: Smartphone,
    placeholder: 'Nomor HP',
    amounts: [10000, 20000, 25000, 50000, 100000, 200000],
  },
  listrik: {
    label: 'Token Listrik',
    icon: Zap,
    placeholder: 'Nomor Meter/ID Pelanggan',
    amounts: [20000, 50000, 100000, 200000, 500000, 1000000],
  },
  pdam: {
    label: 'PDAM',
    icon: Droplets,
    placeholder: 'Nomor Pelanggan',
    amounts: [],
  },
  internet: {
    label: 'Internet',
    icon: Wifi,
    placeholder: 'Nomor Pelanggan',
    amounts: [],
  },
  game: {
    label: 'Game',
    icon: Gamepad2,
    placeholder: 'User ID',
    amounts: [10000, 25000, 50000, 100000, 300000, 500000],
  },
};

const providers = {
  pulsa: ['Telkomsel', 'Indosat', 'XL', 'Tri', 'Smartfren'],
  listrik: ['PLN Prepaid'],
  game: ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact'],
};

export default function Payment() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedProvider, setSelectedProvider] = useState('');

  const paymentConfig = type ? paymentTypes[type] : null;

  if (!paymentConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Layanan tidak ditemukan</p>
      </div>
    );
  }

  const Icon = paymentConfig.icon;
  const providerList = providers[type as keyof typeof providers] || [];

  const handlePayment = () => {
    const balance = storage.getBalance();

    if (selectedAmount > balance.amount) {
      toast({
        title: 'Saldo tidak mencukupi',
        variant: 'destructive',
      });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Nomor tidak valid',
        variant: 'destructive',
      });
      return;
    }

    storage.updateBalance(-selectedAmount);
    storage.addTransaction({
      type: 'payment',
      amount: -selectedAmount,
      description: `${paymentConfig.label} ${selectedProvider || ''} ${phoneNumber.slice(-4)}`,
      category: paymentConfig.label,
      date: new Date(),
      status: 'success',
    });

    toast({
      title: 'Pembayaran Berhasil!',
      description: `${paymentConfig.label} ${storage.formatCurrency(selectedAmount)}`,
    });

    navigate('/');
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-warning/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">{paymentConfig.label}</h1>
        </div>
      </header>

      <main className="relative z-10 space-y-6 px-4 pb-8 pt-4">
        {/* Provider Selection */}
        {providerList.length > 0 && (
          <div className="rounded-2xl bg-card/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Pilih Provider</h3>
            <div className="flex flex-wrap gap-2">
              {providerList.map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    selectedProvider === provider
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number Input */}
        <div className="rounded-2xl bg-card/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{paymentConfig.placeholder}</h3>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={`Masukkan ${paymentConfig.placeholder.toLowerCase()}`}
              className="flex-1 bg-transparent py-4 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Amount Selection */}
        {paymentConfig.amounts.length > 0 && (
          <div className="rounded-2xl bg-card/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Pilih Nominal</h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentConfig.amounts.map((amount) => (
                <motion.button
                  key={amount}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAmount(amount)}
                  className={`rounded-xl p-3 text-sm font-medium transition-colors ${
                    selectedAmount === amount
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {storage.formatCurrency(amount)}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {selectedAmount > 0 && (
          <div className="rounded-2xl bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="text-xl font-bold text-foreground">
                {storage.formatCurrency(selectedAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={!selectedAmount || !phoneNumber}
          className="w-full rounded-2xl bg-gradient-primary p-4 text-center font-semibold text-primary-foreground shadow-button transition-opacity disabled:opacity-50"
        >
          Bayar {selectedAmount ? storage.formatCurrency(selectedAmount) : ''}
        </motion.button>
      </main>
    </div>
  );
}
