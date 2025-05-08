import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalTaskForm from './components/GlobalTaskForm';
import TaskBoard from './components/TaskBoard';
import { PlusIcon } from '@heroicons/react/24/outline';

function App() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    // Update stats whenever tasks change
    const completed = tasks.filter(task => task.isCompleted).length;
    setStats({
      total: tasks.length,
      completed,
      remaining: tasks.length - completed
    });
  }, [tasks]);

  const addTask = (task) => {
    const id = Math.floor(Math.random() * 10000) + 1;
    
    // Check if there are any new tags that need to be added to our tags list
    if (task.tags && task.tags.length > 0) {
      const newTags = task.tags.filter(tag => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
    }
    
    const newTask = { id, ...task };
    setTasks([...tasks, newTask]);
    setShowInput(false);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completeAllTasks = (taskIds = null) => {
    if (taskIds) {
      // Complete specific tasks (for task lists)
      setTasks(tasks.map(task => 
        taskIds.includes(task.id) ? { ...task, isCompleted: true } : task
      ));
    } else {
      // Complete all tasks
      setTasks(tasks.map(task => ({ ...task, isCompleted: true })));
    }
  };

  const deleteCompletedTasks = (taskIds = null) => {
    if (taskIds && taskIds.length > 0) {
      // Delete specific completed tasks (for task lists)
      setTasks(tasks.filter(task => !taskIds.includes(task.id)));
    } else {
      // Delete all completed tasks
      setTasks(tasks.filter(task => !task.isCompleted));
    }
  };

  // Handle tag management operations
  const handleManageTags = (operation, oldTag, newTag = null) => {
    switch (operation) {
      case 'add':
        // Add a new tag if it doesn't already exist
        if (!tags.includes(oldTag)) {
          setTags([...tags, oldTag]);
        }
        break;
        
      case 'edit':
        // Update the tag in our tags list
        setTags(tags.map(tag => tag === oldTag ? newTag : tag));
        
        // Update all tasks that contain the old tag
        setTasks(tasks.map(task => {
          if (task.tags && task.tags.includes(oldTag)) {
            const updatedTags = task.tags.map(tag => 
              tag === oldTag ? newTag : tag
            );
            return { ...task, tags: updatedTags };
          }
          return task;
        }));
        break;
        
      case 'delete':
        // Remove the tag from our tags list
        setTags(tags.filter(tag => tag !== oldTag));
        
        // Remove the tag from all tasks
        setTasks(tasks.map(task => {
          if (task.tags && task.tags.includes(oldTag)) {
            const updatedTags = task.tags.filter(tag => tag !== oldTag);
            return { ...task, tags: updatedTags };
          }
          return task;
        }));
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl">
        <motion.div 
          className="mb-6 bg-white rounded-2xl shadow-soft p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Task Dashboard</h1>
            <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full">
              <span className="text-primary-600 text-sm font-medium">{stats.completed}/{stats.total} done</span>
            </div>
          </div>
          
          <AnimatePresence>
            {showInput ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <GlobalTaskForm 
                  onAdd={addTask} 
                  onCancel={() => setShowInput(false)} 
                  availableTags={tags}
                />
              </motion.div>
            ) : (
              <motion.button
                className="flex items-center justify-center w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                onClick={() => setShowInput(true)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Task
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Task board with multiple task lists */}
        <TaskBoard 
          tasks={tasks}
          tags={tags}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          completeAllTasks={completeAllTasks}
          deleteCompletedTasks={deleteCompletedTasks}
          onManageTags={handleManageTags}
          onAddTask={addTask}
        />
        
        {tasks.length === 0 && !showInput && (
          <motion.div 
            className="text-center py-10 bg-white rounded-2xl shadow-soft mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-neutral-500 text-lg">No tasks yet. Add one to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
