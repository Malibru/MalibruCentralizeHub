import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function MainLayout({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
