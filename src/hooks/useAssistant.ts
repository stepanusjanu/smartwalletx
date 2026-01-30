
import { WalletBalance, Transaction } from '@/types/wallet';
import { storage } from '@/lib/storage';

export function useAssistant(
  message: string,
  balance: WalletBalance | null,
  transactions: Transaction[]
): string {
  const text = message.toLowerCase();

  if (text.includes('cek saldo')) {
    if (!balance) return 'Saldo belum tersedia.';
    return `Saldo Anda saat ini adalah ${storage.formatCurrency(
      balance.amount,
      balance.currency
    )}. Saldo Anda aman dan terlindungi 🔐`;
  }

  if (text.includes('riwayat transaksi')) {
    return `Anda memiliki ${transactions.length} transaksi terakhir. 
Silakan buka menu Riwayat untuk detail lengkap 📄`;
  }

  if (text.includes('tips keamanan')) {
    return `🛡️ Tips Keamanan:

1. Jangan bagikan PIN atau OTP
2. Aktifkan biometrik
3. Periksa notifikasi transaksi
4. Gunakan jaringan aman
5. Update aplikasi secara rutin`;
  }

  if (text.includes('top up')) {
    return `Cara Top Up:

1. Klik tombol "Top Up"
2. Pilih nominal
3. Pilih metode pembayaran
4. Ikuti instruksi

Proses instan & aman ✅`;
  }

  return 'Maaf, saya belum memahami pertanyaan Anda 🤖';
}
