import { NavLink, useLocation } from 'react-router-dom';
import {
  Award,
  Monitor,
  FileText,
  Users,
  Activity,
  User,
  Ticket,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Award, label: 'Certificados', path: '/certificados' },
  { icon: Monitor, label: 'Equipamentos', path: '/equipamentos' },
  { icon: FileText, label: 'Licenças Office', path: '/licencas-office' },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: Activity, label: 'Monitoramento', path: '/monitoramento' },
  { icon: User, label: 'Perfil', path: '/perfil' },
  { icon: Ticket, label: 'Chamados RCN', path: '/chamados-rcn' },
  { icon: MessageSquare, label: 'Chamados Internos', path: '/chamados-internos' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                    "hover:bg-sidebar-accent",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-md text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
