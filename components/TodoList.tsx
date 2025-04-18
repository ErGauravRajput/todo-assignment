

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Todo } from '@/app/page';

interface Props {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo) => void;
}

export default function TodoList({ selectedTodo, setSelectedTodo }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/todos?page=${page}&limit=10`);
      const data = await response.json();
      setTodos(data.todos || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  const createTodo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Todo',
          description: 'Click to edit',
        }),
      });
      
      if (response.ok) {
        fetchTodos();
        toast({
          title: "Success",
          description: "Todo created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={createTodo} className="bg-black text-white">
          <Plus className="w-4 h-4 mr-2" />
          TODO
        </Button>
      </div>

      <div className="space-y-4">
        {Array.isArray(todos) && todos.map((todo) => (
          <Card
            key={todo._id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTodo?._id === todo._id ? 'border-black' : ''
            }`}
            onClick={() => setSelectedTodo(todo)}
          >
            <h3 className="font-semibold">{todo.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(todo.date).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
