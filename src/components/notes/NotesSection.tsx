import { useState } from 'react';
import { Plus, Star, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

const initialNotes = [
  { id: '1', title: 'Reunião com cliente', content: 'Agendar para próxima semana', importance: 3 },
  { id: '2', title: 'Backup mensal', content: 'Verificar logs do último backup', importance: 2 },
  { id: '3', title: 'Atualização do sistema', content: 'Planejar janela de manutenção', importance: 1 },
];

export function NotesSection() {
  const [notes, setNotes] = useState(initialNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', importance: 1 });

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      setNotes(prev => [
        ...prev,
        { id: Date.now().toString(), ...newNote }
      ]);
      setNewNote({ title: '', content: '', importance: 1 });
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleUpdateImportance = (id, importance) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, importance } : n
    ));
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 3: return 'text-destructive';
      case 2: return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notas</h2>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Nova Nota
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isAdding && (
          <div className="bg-muted/50 rounded-lg p-4 border-2 border-dashed border-primary animate-fade-in">
            <Input
              placeholder="Título da nota"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="mb-2"
              autoFocus
            />
            <Textarea
              placeholder="Conteúdo..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="mb-3 min-h-[80px] resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewNote(prev => ({ ...prev, importance: level }))}
                    className={cn(
                      "p-1 rounded transition-colors",
                      newNote.importance >= level ? getImportanceColor(level) : "text-muted"
                    )}
                  >
                    <Star className="h-5 w-5" fill={newNote.importance >= level ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNote}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {notes
          .sort((a, b) => b.importance - a.importance)
          .map((note) => (
            <div
              key={note.id}
              className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/30 transition-colors group animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{note.title}</h3>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{note.content}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleUpdateImportance(note.id, level)}
                    className={cn(
                      "p-0.5 rounded transition-colors hover:scale-110",
                      note.importance >= level ? getImportanceColor(note.importance) : "text-muted"
                    )}
                  >
                    <Star 
                      className="h-4 w-4" 
                      fill={note.importance >= level ? "currentColor" : "none"} 
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
      
      {notes.length === 0 && !isAdding && (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma nota criada. Clique em "Nova Nota" para começar.
        </p>
      )}
    </div>
  );
}
