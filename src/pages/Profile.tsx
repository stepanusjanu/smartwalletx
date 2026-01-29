import { motion } from 'framer-motion';
import { ArrowLeft, User, Shield, Bell, Lock, HelpCircle, LogOut, ChevronRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';

const menuItems = [
  { icon: User, label: 'Edit Profil', route: '/profile/edit' },
  { icon: CreditCard, label: 'Kartu Tersimpan', route: '/profile/cards' },
  { icon: Shield, label: 'Keamanan', route: '/profile/security' },
  { icon: Bell, label: 'Notifikasi', route: '/profile/notifications' },
  { icon: Lock, label: 'Privasi', route: '/profile/privacy' },
  { icon: HelpCircle, label: 'Bantuan', route: '/profile/help' },
];

export default function Profile() {
  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/2 top-0 h-full w-full rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 glass safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="rounded-xl bg-muted/50 p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Profil</h1>
        </div>
      </header>

      <main className="relative z-10 space-y-6 px-4 pb-8 pt-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-button">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">+62 812 **** 5678</p>
              <div className="mt-2 flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5">
                <Shield className="h-3 w-3 text-success" />
                <span className="text-xs font-medium text-success">Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Total Saldo</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {storage.formatCurrency(storage.getBalance().amount)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Poin Reward</p>
              <p className="mt-1 text-lg font-bold text-accent">2,450</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="rounded-2xl bg-card/50 overflow-hidden">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.route}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              {index < menuItems.length - 1 && <div className="mx-4 h-px bg-border" />}
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 p-4 font-semibold text-destructive transition-colors hover:bg-destructive/20"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </motion.button>

        <p className="text-center text-xs text-muted-foreground">
          SmartPay v1.0.0 • Powered by AI
        </p>
      </main>
    </div>
  );
}
