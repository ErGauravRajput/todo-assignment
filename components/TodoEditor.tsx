

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Save } from 'lucide-react';
import { Todo } from '@/app/page';
import { Button } from '@/components/ui/button';

interface Props {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
}

export default function TodoEditor({ selectedTodo, setSelectedTodo }: Props) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.title);
      setDescription(selectedTodo.description);
    }
  }, [selectedTodo]);

  const handleUpdate = async () => {
    if (!selectedTodo) return;

    try {
      const response = await fetch(`http://localhost:3001/api/todos/${selectedTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedTodo,
          title,
          description,
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setSelectedTodo(updatedTodo);
        toast({
          title: "Success",
          description: "Todo updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  if (!selectedTodo) {
    return (
      <Card className="p-6 h-[calc(100vh-12rem)] flex items-center justify-center text-gray-400">
        Select a todo to edit
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Todo</h2>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => setSelectedTodo(null)}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[200px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Created on: {new Date(selectedTodo.date).toLocaleDateString()}
          </p>

          <Button onClick={handleUpdate} className="bg-green-600 text-white flex items-center">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}
