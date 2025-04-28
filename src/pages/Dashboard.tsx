
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useBoardStore } from '@/store/boardStore';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const { boards, createBoard, setActiveBoard } = useBoardStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Board title required',
        description: 'Please enter a title for your board.',
      });
      return;
    }
    
    createBoard(newBoardTitle);
    setNewBoardTitle('');
    setIsCreateDialogOpen(false);
    toast({
      title: 'Board created',
      description: `${newBoardTitle} has been created successfully.`,
    });
  };
  
  const handleBoardClick = (boardId: string) => {
    setActiveBoard(boardId);
    navigate(`/board/${boardId}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Boards</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Board
        </Button>
      </div>
      
      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg border-gray-300 bg-white text-center">
          <h3 className="text-lg font-medium text-gray-700">No boards yet</h3>
          <p className="text-gray-500 mt-1 mb-4">Create a board to get started with your tasks.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create your first board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card 
              key={board.id} 
              className="bg-white hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleBoardClick(board.id)}
            >
              <CardHeader>
                <CardTitle>{board.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {board.lists.reduce((sum, list) => sum + list.tasks.length, 0)} tasks
                </p>
              </CardContent>
              <CardFooter className="text-xs text-gray-400">
                Created {format(new Date(board.createdAt), 'MMM d, yyyy')}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new board</DialogTitle>
            <DialogDescription>
              Give your board a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="board-title">Board Title</Label>
            <Input
              id="board-title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="e.g., Product Launch, Personal Tasks"
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
