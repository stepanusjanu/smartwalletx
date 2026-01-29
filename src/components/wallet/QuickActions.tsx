import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, QrCode, Wallet, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  { id: 'topup', label: 'Top Up', icon: Wallet, route: '/topup', color: 'from-primary to-secondary' },
  { id: 'transfer', label: 'Transfer', icon: ArrowUpRight, route: '/transfer', color: 'from-secondary to-accent' },
  { id: 'qris', label: 'QRIS', icon: QrCode, route: '/qris', color: 'from-accent to-success' },
  { id: 'tarik', label: 'Tarik Tunai', icon: ArrowDownLeft, route: '/withdraw', color: 'from-warning to-primary' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const QuickActions = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-4 gap-4"
    >
      {actions.map((action) => (
        <motion.div key={action.id} variants={item}>
          <Link
            to={action.route}
            className="flex flex-col items-center gap-2"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-button transition-transform hover:scale-105 active:scale-95`}>
              <action.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
