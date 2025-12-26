import { MainLayout } from '../components/layout/MainLayout';
import { Activity, Server, Wifi, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { cn } from '../lib/utils';

const servers = [
  { 
    id: '1', 
    nome: 'SRV-PROD-01', 
    tipo: 'Produção',
    status: 'online',
    cpu: 45,
    memoria: 68,
    disco: 72
  },
  { 
    id: '2', 
    nome: 'SRV-DEV-01', 
    tipo: 'Desenvolvimento',
    status: 'online',
    cpu: 23,
    memoria: 45,
    disco: 35
  },
  { 
    id: '3', 
    nome: 'SRV-DB-01', 
    tipo: 'Banco de Dados',
    status: 'warning',
    cpu: 78,
    memoria: 85,
    disco: 90
  },
  { 
    id: '4', 
    nome: 'SRV-BACKUP-01', 
    tipo: 'Backup',
    status: 'offline',
    cpu: 0,
    memoria: 0,
    disco: 45
  },
];

function StatusBadge({ status }) {
  const colors = {
    online: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    offline: 'bg-destructive text-destructive-foreground',
  };
  
  const labels = {
    online: 'Online',
    warning: 'Alerta',
    offline: 'Offline',
  };

  return (
    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", colors[status])}>
      {labels[status]}
    </span>
  );
}

function ProgressBar({ value, color = 'primary' }) {
  const barColor = value > 80 ? 'bg-destructive' : value > 60 ? 'bg-warning' : 'bg-success';
  
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className={cn("h-full transition-all duration-500", barColor)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ServerCard({ server }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            server.status === 'online' ? 'bg-success/10' : 
            server.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
          )}>
            <Server className={cn(
              "h-5 w-5",
              server.status === 'online' ? 'text-success' : 
              server.status === 'warning' ? 'text-warning' : 'text-destructive'
            )} />
          </div>
          <div>
            <h3 className="font-semibold">{server.nome}</h3>
            <p className="text-sm text-muted-foreground">{server.tipo}</p>
          </div>
        </div>
        <StatusBadge status={server.status} />
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Cpu className="h-4 w-4" /> CPU
            </span>
            <span className="font-medium">{server.cpu}%</span>
          </div>
          <ProgressBar value={server.cpu} />
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MemoryStick className="h-4 w-4" /> Memória
            </span>
            <span className="font-medium">{server.memoria}%</span>
          </div>
          <ProgressBar value={server.memoria} />
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <HardDrive className="h-4 w-4" /> Disco
            </span>
            <span className="font-medium">{server.disco}%</span>
          </div>
          <ProgressBar value={server.disco} />
        </div>
      </div>
    </div>
  );
}

export default function Monitoramento() {
  const onlineCount = servers.filter(s => s.status === 'online').length;
  const warningCount = servers.filter(s => s.status === 'warning').length;
  const offlineCount = servers.filter(s => s.status === 'offline').length;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-1">Monitoramento</h1>
          <p className="text-muted-foreground">
            Status em tempo real dos servidores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success/10 rounded-lg p-4 border border-success/20">
            <div className="flex items-center gap-3">
              <Wifi className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{onlineCount}</p>
                <p className="text-sm text-muted-foreground">Servidores Online</p>
              </div>
            </div>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Em Alerta</p>
              </div>
            </div>
          </div>
          
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <div className="flex items-center gap-3">
              <Server className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{offlineCount}</p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
