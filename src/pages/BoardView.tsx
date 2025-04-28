
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
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
import TaskList from '@/components/board/TaskList';
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';

const BoardView: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { boards, activeBoard, setActiveBoard, updateBoard, deleteBoard, createList } = useBoardStore();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  useEffect(() => {
    if (boardId) {
      const board = boards.find((b) => b.id === boardId);
      if (board) {
        setActiveBoard(boardId);
        setBoardTitle(board.title);
      } else {
        navigate('/dashboard');
        toast({
          variant: 'destructive',
          title: 'Board not found',
          description: 'The board you are looking for does not exist.',
        });
      }
    }
  }, [boardId, boards, navigate, setActiveBoard, toast]);
  
  if (!activeBoard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading board...</p>
      </div>
    );
  }
  
  const handleUpdateBoard = () => {
    if (!boardTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Board title required',
        description: 'Please enter a title for your board.',
      });
      return;
    }
    
    updateBoard(activeBoard.id, boardTitle);
    setIsEditDialogOpen(false);
    toast({
      title: 'Board updated',
      description: 'Board title has been updated successfully.',
    });
  };
  
  const handleDeleteBoard = () => {
    deleteBoard(activeBoard.id);
    setIsDeleteDialogOpen(false);
    navigate('/dashboard');
    toast({
      title: 'Board deleted',
      description: 'The board has been deleted successfully.',
    });
  };
  
  const handleAddList = () => {
    if (!newListTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'List title required',
        description: 'Please enter a title for your list.',
      });
      return;
    }
    
    createList(activeBoard.id, newListTitle);
    setNewListTitle('');
    setIsAddListDialogOpen(false);
    toast({
      title: 'List created',
      description: `${newListTitle} has been created successfully.`,
    });
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Check if we have a valid drop target
    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const sourceListId = active.data.current?.sourceListId as string;
      const destinationListId = over.id.toString();
      
      // Only move if we're not dropping on the same list
      if (sourceListId !== destinationListId) {
        // Call the moveTask function from our store
        useBoardStore.getState().moveTask(
          activeBoard.id,
          sourceListId,
          destinationListId,
          taskId
        );
        
        toast({
          title: 'Task moved',
          description: 'Task has been moved to a new list.',
        });
      }
    }
  };
  
  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{activeBoard.title}</h1>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsAddListDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add List
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)]">
            {activeBoard.lists.map((list) => (
              <TaskList 
                key={list.id} 
                list={list} 
                boardId={activeBoard.id}
              />
            ))}
          </div>
        </DndContext>
      </div>
      
      {/* Edit Board Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit board</DialogTitle>
            <DialogDescription>
              Change the title of your board.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Board title"
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBoard}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Board Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              board and all tasks within it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBoard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add List Dialog */}
      <Dialog open={isAddListDialogOpen} onOpenChange={setIsAddListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new list</DialogTitle>
            <DialogDescription>
              Create a new list to organize your tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="List title"
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardView;
