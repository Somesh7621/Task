
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Task, Priority, useBoardStore } from '@/store/boardStore';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailProps {
  task: Task;
  listId: string;
  boardId: string;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, listId, boardId, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState<Date | null>(
    task.dueDate ? new Date(task.dueDate) : null
  );
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [isEditing, setIsEditing] = useState(false);
  
  const { updateTask } = useBoardStore();
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title required',
        description: 'Please enter a title for the task.',
      });
      return;
    }
    
    const updatedTask: Task = {
      ...task,
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
    };
    
    updateTask(boardId, listId, updatedTask);
    toast({
      title: 'Task updated',
      description: 'Task has been updated successfully.',
    });
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      {isEditing ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate as Date}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <RadioGroup value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-blue-600">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-yellow-600">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-red-600">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="whitespace-pre-wrap text-gray-600">{task.description || 'No description provided.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Due Date</h4>
              <p className="text-gray-600">
                {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Priority</h4>
              <p className="capitalize text-gray-600">{task.priority}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
