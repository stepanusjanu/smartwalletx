import { Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export const Header = ({ title = 'SmartPay' }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass safe-area-top">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-button"
          >
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-gradient-primary">{title}</h1>
            <p className="text-xs text-muted-foreground">Selamat datang kembali!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="relative rounded-xl bg-muted/50 p-2.5 transition-colors hover:bg-muted">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <button className="rounded-xl bg-muted/50 p-2.5 transition-colors hover:bg-muted">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};
