import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'A Fazer',
    color: 'kanban-todo',
    tasks: [
      { id: '1', title: 'Revisar relatório mensal', priority: 'high' },
      { id: '2', title: 'Atualizar documentação', priority: 'medium' },
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'Em Progresso',
    color: 'kanban-progress',
    tasks: [
      { id: '3', title: 'Implementar novo módulo', priority: 'high' },
    ]
  },
  done: {
    id: 'done',
    title: 'Concluído',
    color: 'kanban-done',
    tasks: [
      { id: '4', title: 'Backup de dados', priority: 'low' },
    ]
  }
};

const priorityColors = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-success/20 text-success border-success/30'
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa'
};

export function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [newTask, setNewTask] = useState({ columnId: null, title: '', priority: 'medium' });
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const handleAddTask = (columnId) => {
    if (newTask.columnId === columnId && newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        priority: newTask.priority
      };
      
      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: [...prev[columnId].tasks, task]
        }
      }));
      setNewTask({ columnId: null, title: '', priority: 'medium' });
    } else {
      setNewTask({ columnId, title: '', priority: 'medium' });
    }
  };

  const handleDeleteTask = (columnId, taskId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: prev[columnId].tasks.filter(t => t.id !== taskId)
      }
    }));
  };

  const handleDragStart = (e, columnId, task) => {
    setDraggedTask({ columnId, task });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { columnId: sourceColumnId, task } = draggedTask;
    
    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns(prev => {
      const newColumns = { ...prev };
      newColumns[sourceColumnId] = {
        ...newColumns[sourceColumnId],
        tasks: newColumns[sourceColumnId].tasks.filter(t => t.id !== task.id)
      };
      newColumns[targetColumnId] = {
        ...newColumns[targetColumnId],
        tasks: [...newColumns[targetColumnId].tasks, task]
      };
      return newColumns;
    });
    
    setDraggedTask(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <h2 className="text-lg font-semibold mb-4">Quadro de Tarefas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            className="bg-muted/50 rounded-lg p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-3 h-3 rounded-full", `bg-${column.color}`)} />
              <h3 className="font-medium text-sm">{column.title}</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="space-y-2 min-h-[100px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id, task)}
                  className="bg-card rounded-md p-3 shadow-sm border border-border cursor-move hover:shadow-card-hover transition-shadow group"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <span className={cn(
                        "inline-block text-xs px-2 py-0.5 rounded-full mt-1.5 border",
                        priorityColors[task.priority]
                      )}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(column.id, task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {newTask.columnId === column.id ? (
                <div className="bg-card rounded-md p-3 border border-primary shadow-sm space-y-2">
                  <Input
                    placeholder="Título da tarefa"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    autoFocus
                    className="h-8 text-sm"
                  />
                  <div className="flex gap-1">
                    {Object.keys(priorityLabels).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                        className={cn(
                          "text-xs px-2 py-1 rounded border transition-colors",
                          newTask.priority === p ? priorityColors[p] : "bg-muted text-muted-foreground"
                        )}
                      >
                        {priorityLabels[p]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => handleAddTask(column.id)}>
                      <Check className="h-3 w-3 mr-1" /> Salvar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => setNewTask({ columnId: null, title: '', priority: 'medium' })}
                    >
                      <X className="h-3 w-3 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAddTask(column.id)}
                  className="w-full p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Adicionar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
