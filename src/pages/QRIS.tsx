import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Camera, Image, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

export default function QRIS() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{ merchant: string; amount: number } | null>(null);

  // Simulate QR scan
  const handleSimulateScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setScannedData({
        merchant: 'Toko Sembako Sejahtera',
        amount: 75000,
      });
    }, 2000);
  };

  const handlePay = () => {
    if (!scannedData) return;
    
    const balance = storage.getBalance();
    if (scannedData.amount > balance.amount) {
      toast({
        title: 'Saldo tidak mencukupi',
        variant: 'destructive',
      });
      return;
    }

    storage.updateBalance(-scannedData.amount);
    storage.addTransaction({
      type: 'payment',
      amount: -scannedData.amount,
      description: `QRIS - ${scannedData.merchant}`,
      category: 'QRIS',
      date: new Date(),
      status: 'success',
    });

    toast({
      title: 'Pembayaran QRIS Berhasil!',
      description: `${storage.formatCurrency(scannedData.amount)} ke ${scannedData.merchant}`,
      variant: 'success'
    });

    navigate('/');
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Scan QRIS</h1>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center px-4 pb-8 pt-8">
        {!scannedData ? (
          <>
            {/* Scanner Area */}
            <div className="relative mb-8 aspect-square w-full max-w-xs overflow-hidden rounded-3xl border-2 border-primary/30 bg-card/30">
              {isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-1 w-full bg-gradient-primary"
                    initial={{ y: 0 }}
                    animate={{ y: [0, 280, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="rounded-2xl bg-primary/20 p-6">
                    <QrCode className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Arahkan kamera ke kode QR
                  </p>
                </div>
              )}

              {/* Corner markers */}
              <div className="absolute left-4 top-4 h-8 w-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
              <div className="absolute right-4 top-4 h-8 w-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-primary p-4 font-semibold text-primary-foreground shadow-button disabled:opacity-50"
              >
                <Camera className="h-5 w-5" />
                {isScanning ? 'Memindai...' : 'Scan QR'}
              </motion.button>
              <button className="rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <Image className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Scan kode QRIS dari merchant untuk melakukan pembayaran
            </p>
          </>
        ) : (
          /* Payment Confirmation */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="rounded-2xl bg-card/50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground">QR Terdeteksi</h2>
              <p className="mt-2 text-muted-foreground">{scannedData.merchant}</p>
            </div>

            <div className="rounded-2xl bg-card/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Pembayaran</span>
                <span className="text-2xl font-bold text-foreground">
                  {storage.formatCurrency(scannedData.amount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo tersedia</span>
                <span className="text-muted-foreground">
                  {storage.formatCurrency(storage.getBalance().amount)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setScannedData(null)}
                className="flex-1 rounded-2xl bg-muted/50 p-4 font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Batal
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                className="flex-1 rounded-2xl bg-gradient-primary p-4 font-semibold text-primary-foreground shadow-button"
              >
                Bayar
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
