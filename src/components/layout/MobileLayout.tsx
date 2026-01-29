import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  title?: string;
}

export const MobileLayout = ({ 
  children, 
  showHeader = true, 
  showNav = true,
  title 
}: MobileLayoutProps) => {
  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      
      {showHeader && <Header title={title} />}
      
      <main className={`relative z-10 px-4 ${showNav ? 'pb-24' : 'pb-4'} ${showHeader ? 'pt-4' : 'pt-8'}`}>
        {children}
      </main>
      
      {showNav && <BottomNav />}
    </div>
  );
};
