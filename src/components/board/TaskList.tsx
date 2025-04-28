
import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash, Plus } from 'lucide-react';
import { useBoardStore, TaskList as TaskListType, Task } from '@/store/boardStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import { useDroppable } from '@dnd-kit/core';

interface TaskListProps {
  list: TaskListType;
  boardId: string;
}

const TaskList: React.FC<TaskListProps> = ({ list, boardId }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  
  const { updateList, deleteList } = useBoardStore();
  const { toast } = useToast();
  
  const { setNodeRef } = useDroppable({
    id: list.id,
  });
  
  const handleUpdateList = () => {
    if (!listTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'List title required',
        description: 'Please enter a title for your list.',
      });
      return;
    }
    
    updateList(boardId, list.id, listTitle);
    setIsEditDialogOpen(false);
    toast({
      title: 'List updated',
      description: 'List title has been updated successfully.',
    });
  };
  
  const handleDeleteList = () => {
    deleteList(boardId, list.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'List deleted',
      description: 'The list has been deleted successfully.',
    });
  };
  
  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    useBoardStore.getState().createTask(boardId, list.id, task);
    setIsAddTaskDialogOpen(false);
    toast({
      title: 'Task created',
      description: 'New task has been created successfully.',
    });
  };
  
  return (
    <div ref={setNodeRef} className="list-column">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">{list.title} ({list.tasks.length})</h3>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsAddTaskDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>List Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)} 
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {list.tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            No tasks yet
          </div>
        ) : (
          list.tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              listId={list.id}
              boardId={boardId}
            />
          ))
        )}
      </div>
      
      {/* Edit List Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit list</DialogTitle>
            <DialogDescription>
              Change the title of this list.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="List title"
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete List Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will delete this list and all tasks within it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteList}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a task</DialogTitle>
            <DialogDescription>
              Create a new task in this list.
            </DialogDescription>
          </DialogHeader>
          <AddTaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
