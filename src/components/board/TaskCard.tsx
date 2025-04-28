
import React, { useState } from 'react';
import { Flag, Calendar, MoreHorizontal } from 'lucide-react';
import { useBoardStore, Task, Priority } from '@/store/boardStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskDetail from './TaskDetail';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  listId: string;
  boardId: string;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-600',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-red-100 text-red-600',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, listId, boardId }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { deleteTask } = useBoardStore();
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
      sourceListId: listId,
    },
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1,
  } : undefined;
  
  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent opening the task detail modal when clicking the dropdown
    if ((e.target as HTMLElement).closest('[data-dropdown]')) {
      return;
    }
    
    setIsDetailOpen(true);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(boardId, listId, task.id);
  };
  
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card fade-in"
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
          
          <div className={cn('text-xs px-2 py-1 rounded-full font-medium', priorityColors[task.priority])}>
            <Flag className="h-3 w-3 inline mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
        </div>
      </div>
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Task Details</DialogTitle>
          </DialogHeader>
          <TaskDetail
            task={task}
            listId={listId}
            boardId={boardId}
            onClose={() => setIsDetailOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
