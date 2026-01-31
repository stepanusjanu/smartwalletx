import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Wallet, Building2, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

const ewallets = [
  { id: 'ovo', name: 'OVO', color: 'from-purple-500 to-purple-600' },
  { id: 'gopay', name: 'GoPay', color: 'from-green-500 to-green-600' },
  { id: 'dana', name: 'DANA', color: 'from-blue-500 to-blue-600' },
  { id: 'shopeepay', name: 'ShopeePay', color: 'from-orange-500 to-orange-600' },
  { id: 'linkaja', name: 'LinkAja', color: 'from-red-500 to-red-600' },
];

const banks = [
  { id: 'bca', name: 'BCA', code: '014' },
  { id: 'mandiri', name: 'Mandiri', code: '008' },
  { id: 'bni', name: 'BNI', code: '009' },
  { id: 'bri', name: 'BRI', code: '002' },
  { id: 'cimb', name: 'CIMB Niaga', code: '022' },
];

const amounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

export default function TopUp() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'ewallet' | 'bank'>('ewallet');
  const [selectedSource, setSelectedSource] = useState<string>('');

  const handleTopUp = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    const signedAmount = selectedMethod === 'bank' ? amount : -amount;
    const balance = await storage.getBalance();

    if (amount < 10000) {
      toast({
        title: 'Jumlah minimum Rp 10.000',
        variant: 'destructive',
      });
      return;
    }
    
    if(selectedMethod === 'ewallet' && amount > balance.amount){
      toast({
        title: 'Saldo tidak mencukupi',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSource) {
      toast({
        title: 'Pilih metode pembayaran',
        variant: 'destructive',
      });
      return;
    }

    const pendingTx = await storage.addPendingTransaction({
      type: 'topup',
      source: selectedMethod,
      amount: signedAmount,
      description:
        selectedMethod === 'bank'
        ? `Top Up via Bank ${selectedSource}`
        : `Top Up ke ${selectedSource}`,
      category: 'Top Up',
    });

    toast({
      title: 'Top Up diproses',
      description: `Menunggu Konfirmasi.....`,
    });

    const PROCESS_DURATION = 3000;

    setTimeout(async () => {
      await storage.confirmTransaction(pendingTx.id);

      toast({
        title: 'Top Up Berhasil',
        description: storage.formatCurrency(amount),
        variant: 'success'
      });

      navigate('/');
    }, PROCESS_DURATION);

    

    // if (selectedMethod === 'bank') {
    //   await storage.updateBalance(amount);
    //   await storage.addTransaction({
    //     type: 'topup',
    //     amount: amount,
    //     description: `Top Up via Bank ${selectedSource}`,
    //     category: 'Top Up',
    //     date: new Date(),
    //     status: 'success',
    //   });
    //
    //   toast({
    //     title: 'Top Up Berhasil',
    //     description: `Saldo bertambah ${storage.formatCurrency(amount)}`,
    //   });
    // }else{
    //    const transferAmount = parseInt(amount);
    //    const balance = await storage.getBalance();
    //
    //   if (transferAmount > balance.amount) {
    //     toast({
    //       title: 'Saldo tidak mencukupi',
    //       variant: 'destructive',
    //     });
    //     return;
    //   }
    //
    //   if (transferAmount < 10000) {
    //     toast({
    //       title: 'Minimal transfer Rp 10.000',
    //       variant: 'destructive',
    //     });
    //     return;
    //   }
    //
    //   await storage.updateBalance(-transferAmount);
    //   await storage.addTransaction({
    //     type: 'topup',
    //     amount: -transferAmount,
    //     description: `Top Up ke ${accountName}`,
    //     category: 'Top Up',
    //     date: new Date(),
    //     status: 'success',
    //   });
    //
    //   toast({
    //     title: `Top Up ke ${wallet.name}`,
    //     description: `${storage.formatCurrency(transferAmount)} ke ${accountName}`,
    //   });
    // }


    // storage.updateBalance(amount);
    // storage.addTransaction({
    //   type: 'topup',
    //   amount: amount,
    //   description: `Top Up via ${selectedSource || 'Transfer'}`,
    //   category: 'Top Up',
    //   date: new Date(),
    //   status: 'success',
    // });
    //
    // toast({
    //   title: 'Top Up Berhasil!',
    //   description: `Saldo Anda bertambah ${storage.formatCurrency(amount)}`,
    // });
};

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Top Up Saldo</h1>
        </div>
      </header>

      <main className="relative z-10 space-y-6 px-4 pb-8 pt-4">
        {/* Amount Selection */}
        <div className="rounded-2xl bg-card/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Pilih Nominal</h3>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`rounded-xl p-3 text-sm font-medium transition-colors ${
                  selectedAmount === amount && !customAmount
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {storage.formatCurrency(amount)}
              </motion.button>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="text-sm text-muted-foreground">Atau masukkan nominal lain</label>
            <div className="mt-2 flex items-center rounded-xl bg-muted/50 px-4">
              <span className="text-sm text-muted-foreground">Rp</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent py-3 pl-2 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div className="rounded-2xl bg-card/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Metode Top Up</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMethod('ewallet')}
              className={`flex-1 rounded-xl p-3 text-sm font-medium transition-colors ${
                selectedMethod === 'ewallet'
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              <Wallet className="mx-auto mb-1 h-5 w-5" />
              E-Wallet
            </button>
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`flex-1 rounded-xl p-3 text-sm font-medium transition-colors ${
                selectedMethod === 'bank'
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              <Building2 className="mx-auto mb-1 h-5 w-5" />
              Transfer Bank
            </button>
          </div>
        </div>

        {/* Source Selection */}
        <div className="rounded-2xl bg-card/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {selectedMethod === 'ewallet' ? 'Pilih E-Wallet' : 'Pilih Bank'}
          </h3>
          <div className="space-y-2">
            {selectedMethod === 'ewallet'
              ? ewallets.map((wallet) => (
                  <motion.button
                    key={wallet.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSource(wallet.name)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                      selectedSource === wallet.name
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${wallet.color}`}>
                      <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{wallet.name}</span>
                  </motion.button>
                ))
              : banks.map((bank) => (
                  <motion.button
                    key={bank.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSource(bank.name)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                      selectedSource === bank.name
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                      <Building2 className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{bank.name}</p>
                      <p className="text-xs text-muted-foreground">Kode: {bank.code}</p>
                    </div>
                  </motion.button>
                ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTopUp}
          disabled={!selectedSource}
          className="w-full rounded-2xl bg-gradient-primary p-4 text-center font-semibold text-primary-foreground shadow-button transition-opacity disabled:opacity-50"
        >
          Top Up {storage.formatCurrency(customAmount ? parseInt(customAmount) || 0 : selectedAmount)}
        </motion.button>
      </main>
    </div>
  );
}
