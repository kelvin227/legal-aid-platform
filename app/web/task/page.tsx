"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash, Check, Square, ClipboardList, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};


const App = () => {
  // Use a state hook to manage the list of tasks
const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);  const [newTaskText, setNewTaskText] = useState<string>('');
const router = useRouter();
  // Effect to load tasks from localStorage when the component mounts
  useEffect(() => {
    // Retrieve the string from localStorage and parse it into a JavaScript object
const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];    setTasks(savedTasks);
  }, []);

  // Effect to save tasks to localStorage whenever the 'tasks' state changes
  useEffect(() => {
    // Stringify the tasks array and save it to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Function to handle adding a new task
  const handleAddTask = (e: any) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;

    const newTask = {
      id: Date.now(), // Use a unique ID based on the current timestamp
      text: newTaskText.trim(),
      completed: false,
    };

    // Add the new task to the list
    setTasks([...tasks, newTask]);
    // Clear the input field
    setNewTaskText('');
  };

  // Function to toggle a task's completed status
  const handleToggleComplete = (taskId: any) => {
    // Map over the tasks and toggle the completed status of the matching task
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: any) => {
    // Filter out the task with the matching ID
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Placeholder function for the back button
  const handleBackClick = () => {
    // In a full application, this would handle navigation
router.replace("/dashboard")  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 lg:p-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
        {/* Page Header and Back Button */}
        <div className="mb-6 border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <ClipboardList size={28} className="mr-3 text-blue-600" />
              Task Manager
            </h1>
          </div>
          <button
            onClick={handleBackClick}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Back to Dashboard"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
              Organize your daily tasks here.
          </p>

        {/* New Task Input Form */}
        <form onSubmit={handleAddTask} className="flex space-x-2 mb-6">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow duration-200"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* Task List */}
        <div className="overflow-y-auto max-h-96">
          <ul className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                    >
                      {task.completed ? (
                        <Check size={20} className="text-green-600 dark:text-green-400" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                    <span
                      className={`text-md font-medium ${
                        task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash size={20} />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                No tasks to show. Add a new task above!
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
