import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Drawer, DrawerContent } from '../ui/drawer';

export function MainLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <div className="flex">
        {isMobile ? (
          <>
            <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
              <DrawerContent className="p-0">
                <Sidebar />
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Sidebar />
        )}
        <main className="flex-1 p-6 overflow-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
