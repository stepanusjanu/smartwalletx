import { motion } from 'framer-motion';
import { Home, History, QrCode, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'home', label: 'Beranda', icon: Home, route: '/' },
  { id: 'history', label: 'Riwayat', icon: History, route: '/history' },
  { id: 'qris', label: 'Scan', icon: QrCode, route: '/qris', isMain: true },
  { id: 'chat', label: 'Asisten', icon: MessageSquare, route: '/assistant' },
  { id: 'profile', label: 'Profil', icon: User, route: '/profile' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          
          if (item.isMain) {
            return (
              <Link
                key={item.id}
                to={item.route}
                className="relative -mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-button"
                >
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.route}
              className="relative flex flex-col items-center gap-1 px-3 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-gradient-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
