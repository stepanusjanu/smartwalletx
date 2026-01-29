import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Zap, 
  Droplets, 
  Wifi, 
  Gamepad2, 
  ShoppingBag,
  Plane,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { id: 'pulsa', label: 'Pulsa', icon: Smartphone, route: '/payment/pulsa', color: 'text-primary' },
  { id: 'listrik', label: 'Listrik', icon: Zap, route: '/payment/listrik', color: 'text-warning' },
  { id: 'pdam', label: 'PDAM', icon: Droplets, route: '/payment/pdam', color: 'text-secondary' },
  { id: 'internet', label: 'Internet', icon: Wifi, route: '/payment/internet', color: 'text-accent' },
  { id: 'game', label: 'Game', icon: Gamepad2, route: '/payment/game', color: 'text-destructive' },
  { id: 'shopping', label: 'Belanja', icon: ShoppingBag, route: '/payment/shopping', color: 'text-success' },
  { id: 'travel', label: 'Travel', icon: Plane, route: '/payment/travel', color: 'text-primary' },
  { id: 'insurance', label: 'Asuransi', icon: Heart, route: '/payment/insurance', color: 'text-destructive' },
  { id: 'more', label: 'Lainnya', icon: MoreHorizontal, route: '/services', color: 'text-muted-foreground' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export const ServiceGrid = () => {
  return (
    <div className="rounded-2xl bg-card/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Layanan</h3>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4"
      >
        {services.map((service) => (
          <motion.div key={service.id} variants={item}>
            <Link
              to={service.route}
              className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                <service.icon className={`h-6 w-6 ${service.color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{service.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
