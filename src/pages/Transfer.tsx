import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Building2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

const banks = [
  { id: 'bca', name: 'BCA', code: '014' },
  { id: 'mandiri', name: 'Mandiri', code: '008' },
  { id: 'bni', name: 'BNI', code: '009' },
  { id: 'bri', name: 'BRI', code: '002' },
  { id: 'cimb', name: 'CIMB Niaga', code: '022' },
  { id: 'danamon', name: 'Danamon', code: '011' },
  { id: 'permata', name: 'Permata', code: '013' },
  { id: 'ocbc', name: 'OCBC NISP', code: '028' },
];

const recentTransfers = [
  { name: 'John Doe', bank: 'BCA', account: '****1234' },
  { name: 'Sarah Smith', bank: 'Mandiri', account: '****5678' },
];

export default function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<typeof banks[0] | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckAccount = () => {
    // Simulate account check
    if (accountNumber.length >= 10) {
      setAccountName('Pemilik Rekening');
      setStep(2);
    } else {
      toast({
        title: 'Nomor rekening tidak valid',
        variant: 'destructive',
      });
    }
  };

  const handleTransfer = async () => {
    const transferAmount = parseInt(amount);
    const balance = await storage.getBalance();

    if (transferAmount > balance.amount) {
      toast({
        title: 'Saldo tidak mencukupi',
        variant: 'destructive',
      });
      return;
    }

    if (transferAmount < 10000) {
      toast({
        title: 'Minimal transfer Rp 10.000',
        variant: 'destructive',
      });
      return;
    }

    storage.updateBalance(-transferAmount);
    storage.addTransaction({
      type: 'transfer',
      amount: -transferAmount,
      description: `Transfer ke ${accountName}`,
      category: 'Transfer',
      date: new Date(),
      status: 'success',
    });

    toast({
      title: 'Transfer Berhasil!',
      description: `${storage.formatCurrency(transferAmount)} ke ${accountName}`,
    });

    navigate('/');
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Transfer Bank</h1>
        </div>
      </header>

      <main className="relative z-10 space-y-6 px-4 pb-8 pt-4">
        {step === 1 && (
          <>
            {/* Recent Transfers */}
            {recentTransfers.length > 0 && (
              <div className="rounded-2xl bg-card/50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Transfer Terakhir</h3>
                <div className="space-y-2">
                  {recentTransfers.map((transfer, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setAccountName(transfer.name);
                        setStep(2);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl bg-muted/30 p-3 hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{transfer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {transfer.bank} • {transfer.account}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Selection */}
            <div className="rounded-2xl bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Pilih Bank Tujuan</h3>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari bank..."
                  className="w-full rounded-xl bg-muted/50 py-3 pl-10 pr-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                {filteredBanks.map((bank) => (
                  <motion.button
                    key={bank.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBank(bank)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                      selectedBank?.id === bank.id
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

            {selectedBank && (
              <div className="rounded-2xl bg-card/50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Nomor Rekening</h3>
                <input
                  type="number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Masukkan nomor rekening"
                  className="w-full rounded-xl bg-muted/50 p-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                />
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckAccount}
                  disabled={accountNumber.length < 10}
                  className="mt-4 w-full rounded-xl bg-gradient-primary p-4 font-semibold text-primary-foreground shadow-button disabled:opacity-50"
                >
                  Lanjutkan
                </motion.button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {/* Recipient Info */}
            <div className="rounded-2xl bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Penerima</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                  <User className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{accountName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBank?.name} • {accountNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="rounded-2xl bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Jumlah Transfer</h3>
              <div className="flex items-center rounded-xl bg-muted/50 px-4">
                <span className="text-lg font-semibold text-muted-foreground">Rp</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent py-4 pl-2 text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Saldo tersedia: {storage.formatCurrency(storage.getBalance().amount)}
              </p>
            </div>

            {/* Note */}
            <div className="rounded-2xl bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Catatan (Opsional)</h3>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tambahkan catatan..."
                className="w-full rounded-xl bg-muted/50 p-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleTransfer}
              disabled={!amount || parseInt(amount) < 10000}
              className="w-full rounded-2xl bg-gradient-primary p-4 font-semibold text-primary-foreground shadow-button disabled:opacity-50"
            >
              Transfer {amount ? storage.formatCurrency(parseInt(amount)) : 'Rp 0'}
            </motion.button>
          </>
        )}
      </main>
    </div>
  );
}
