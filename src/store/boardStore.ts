
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lists: TaskList[];
}

interface BoardState {
  boards: Board[];
  activeBoard: Board | null;
  createBoard: (title: string) => void;
  updateBoard: (id: string, title: string) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string) => void;
  createList: (boardId: string, title: string) => void;
  updateList: (boardId: string, listId: string, title: string) => void;
  deleteList: (boardId: string, listId: string) => void;
  createTask: (boardId: string, listId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (boardId: string, listId: string, task: Task) => void;
  deleteTask: (boardId: string, listId: string, taskId: string) => void;
  moveTask: (boardId: string, sourceListId: string, destinationListId: string, taskId: string) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [],
      activeBoard: null,
      
      createBoard: (title) => {
        const newBoard: Board = {
          id: crypto.randomUUID(),
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lists: [
            {
              id: crypto.randomUUID(),
              title: 'To Do',
              tasks: [],
            },
            {
              id: crypto.randomUUID(),
              title: 'In Progress',
              tasks: [],
            },
            {
              id: crypto.randomUUID(),
              title: 'Done',
              tasks: [],
            },
          ],
        };
        
        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoard: newBoard,
        }));
      },
      
      updateBoard: (id, title) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, title, updatedAt: new Date().toISOString() }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === id
              ? { ...state.activeBoard, title, updatedAt: new Date().toISOString() }
              : state.activeBoard,
        }));
      },
      
      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          activeBoard: state.activeBoard?.id === id ? null : state.activeBoard,
        }));
      },
      
      setActiveBoard: (id) => {
        set((state) => ({
          activeBoard: state.boards.find((board) => board.id === id) || null,
        }));
      },
      
      createList: (boardId, title) => {
        const newList = {
          id: crypto.randomUUID(),
          title,
          tasks: [],
        };
        
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: [...board.lists, newList],
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: [...state.activeBoard.lists, newList],
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      updateList: (boardId, listId, title) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId ? { ...list, title } : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: state.activeBoard.lists.map((list) =>
                    list.id === listId ? { ...list, title } : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      deleteList: (boardId, listId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.filter((list) => list.id !== listId),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: state.activeBoard.lists.filter((list) => list.id !== listId),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      createTask: (boardId, listId, taskData) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? { ...list, tasks: [...list.tasks, newTask] }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: state.activeBoard.lists.map((list) =>
                    list.id === listId
                      ? { ...list, tasks: [...list.tasks, newTask] }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      updateTask: (boardId, listId, updatedTask) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          tasks: list.tasks.map((task) =>
                            task.id === updatedTask.id
                              ? { ...updatedTask, updatedAt: new Date().toISOString() }
                              : task
                          ),
                        }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: state.activeBoard.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          tasks: list.tasks.map((task) =>
                            task.id === updatedTask.id
                              ? { ...updatedTask, updatedAt: new Date().toISOString() }
                              : task
                          ),
                        }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      deleteTask: (boardId, listId, taskId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          tasks: list.tasks.filter((task) => task.id !== taskId),
                        }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
          activeBoard:
            state.activeBoard?.id === boardId
              ? {
                  ...state.activeBoard,
                  lists: state.activeBoard.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          tasks: list.tasks.filter((task) => task.id !== taskId),
                        }
                      : list
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeBoard,
        }));
      },
      
      moveTask: (boardId, sourceListId, destinationListId, taskId) => {
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;
          
          const sourceList = board.lists.find((l) => l.id === sourceListId);
          if (!sourceList) return state;
          
          const task = sourceList.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          
          return {
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    lists: board.lists.map((list) => {
                      // Remove from source list
                      if (list.id === sourceListId) {
                        return {
                          ...list,
                          tasks: list.tasks.filter((t) => t.id !== taskId),
                        };
                      }
                      
                      // Add to destination list
                      if (list.id === destinationListId) {
                        return {
                          ...list,
                          tasks: [...list.tasks, { ...task, updatedAt: new Date().toISOString() }],
                        };
                      }
                      
                      return list;
                    }),
                    updatedAt: new Date().toISOString(),
                  }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    lists: state.activeBoard.lists.map((list) => {
                      // Remove from source list
                      if (list.id === sourceListId) {
                        return {
                          ...list,
                          tasks: list.tasks.filter((t) => t.id !== taskId),
                        };
                      }
                      
                      // Add to destination list
                      if (list.id === destinationListId) {
                        return {
                          ...list,
                          tasks: [...list.tasks, { ...task, updatedAt: new Date().toISOString() }],
                        };
                      }
                      
                      return list;
                    }),
                    updatedAt: new Date().toISOString(),
                  }
                : state.activeBoard,
          };
        });
      },
    }),
    {
      name: 'board-storage',
    }
  )
);
