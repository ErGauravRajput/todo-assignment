
'use client';

import { useState } from 'react';
import TodoList from '@/components/TodoList';
import TodoEditor from '@/components/TodoEditor';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">📝 TODO</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TodoList
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
          <TodoEditor
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
        </div>
      </div>
    </main>
  );
}
