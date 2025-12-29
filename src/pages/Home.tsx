import { MainLayout } from '../components/layout/MainLayout';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { NotesSection } from '../components/notes/NotesSection';

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e anotações
          </p>
        </div>
        
        <KanbanBoard />
        <NotesSection />
      </div>
    </MainLayout>
  );
}
