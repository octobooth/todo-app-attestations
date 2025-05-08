import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, CheckCircleIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import TaskList from './TaskList';
import TaskListConfig from './TaskListConfig';
import TagManager from './TagManager';
import ListAddTask from './ListAddTask';

function TaskBoard({ tasks, tags, toggleTask, deleteTask, completeAllTasks, deleteCompletedTasks, onManageTags, onAddTask }) {
  const [taskLists, setTaskLists] = useState([
    { id: 'default', title: 'All Tasks', filters: [] }
  ]);
  
  const [editingListId, setEditingListId] = useState(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [addingTaskToListId, setAddingTaskToListId] = useState(null);

  // Add a new task list
  const addTaskList = () => {
    const newList = {
      id: `list-${Date.now()}`,
      title: 'New List',
      filters: []
    };
    setTaskLists([...taskLists, newList]);
    // Start editing the new list
    setEditingListId(newList.id);
  };

  // Update a task list's title or filters
  const updateTaskList = (id, updates) => {
    setTaskLists(
      taskLists.map(list => 
        list.id === id ? { ...list, ...updates } : list
      )
    );
    setEditingListId(null);
  };

  // Delete a task list
  const deleteTaskList = (id) => {
    // Don't allow deleting the default list
    if (id === 'default') return;
    setTaskLists(taskLists.filter(list => list.id !== id));
  };

  // Filter tasks according to the task list's filter configuration
  const getFilteredTasks = (filterConfig) => {
    if (!filterConfig || filterConfig.length === 0) {
      return tasks;
    }
    
    return tasks.filter(task => {
      // ALL filters must match (AND logic)
      return filterConfig.every(filter => {
        if (filter.type === 'tag') {
          return task.tags && task.tags.includes(filter.value);
        }
        if (filter.type === 'completed') {
          return task.isCompleted === filter.value;
        }
        return true;
      });
    });
  };

  // Start editing a task list's configuration
  const handleEditTaskList = (id) => {
    setEditingListId(id);
  };

  // Handle tag management
  const handleManageTags = () => {
    setShowTagManager(true);
  };
  
  // Handle adding a task to a specific list
  const handleAddTaskToList = (listId) => {
    setAddingTaskToListId(listId);
  };

  // Complete all tasks in a specific list
  const handleCompleteListTasks = (listId) => {
    const list = taskLists.find(l => l.id === listId);
    if (!list) return;
    
    // Get the tasks that are visible in this list based on its filters
    const filteredTasks = getFilteredTasks(list.filters);
    
    // Extract just the IDs of these filtered tasks to complete
    const filteredTaskIds = filteredTasks.map(task => task.id);
    
    // Pass these IDs to the completeAllTasks function
    completeAllTasks(filteredTaskIds);
  };

  // Delete completed tasks in a specific list
  const handleDeleteListCompletedTasks = (listId) => {
    const list = taskLists.find(l => l.id === listId);
    if (!list) return;
    
    // Get the tasks that are visible in this list based on its filters
    const filteredTasks = getFilteredTasks(list.filters);
    
    // Extract just the IDs of the completed tasks in this filtered list
    const completedFilteredTaskIds = filteredTasks
      .filter(task => task.isCompleted)
      .map(task => task.id);
    
    // Pass these IDs to the deleteCompletedTasks function
    deleteCompletedTasks(completedFilteredTaskIds);
  };

  return (
    <div className="task-board">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-neutral-700">Task Lists</h2>
        <button 
          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors px-3 py-1.5 hover:bg-primary-50 rounded-lg"
          onClick={handleManageTags}
        >
          <TagIcon className="h-4 w-4 mr-2" />
          Manage Tags
        </button>
      </div>
      
      {/* Tag Manager Modal */}
      <AnimatePresence>
        {showTagManager && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTagManager(false)}
          >
            <motion.div 
              className="p-1 rounded-xl max-w-md w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <TagManager 
                tags={tags}
                onAddTag={(tag) => onManageTags('add', tag)}
                onEditTag={(oldTag, newTag) => onManageTags('edit', oldTag, newTag)}
                onDeleteTag={(tag) => onManageTags('delete', tag)}
                onClose={() => setShowTagManager(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-4">
        {taskLists.map(list => {
          const filteredTasks = getFilteredTasks(list.filters);
          const hasCompletedTasks = filteredTasks.some(task => task.isCompleted);
          const allTasksCompleted = filteredTasks.length > 0 && filteredTasks.every(task => task.isCompleted);
          
          return (
            <div 
              key={list.id} 
              className="task-list-container bg-white rounded-xl shadow-soft w-full md:w-[calc(50%-0.5rem)] lg:w-80 flex-shrink-0 flex flex-col"
            >
              {editingListId === list.id ? (
                <TaskListConfig 
                  taskList={list}
                  availableTags={tags}
                  onSave={(updates) => updateTaskList(list.id, updates)}
                  onCancel={() => setEditingListId(null)}
                />
              ) : (
                <>
                  <div className="list-header p-4 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="font-medium text-lg">{list.title}</h2>
                    <div className="flex gap-2">
                      <button 
                        className="text-sm text-neutral-500 hover:text-neutral-700 px-2 py-1 hover:bg-neutral-100 rounded"
                        onClick={() => handleEditTaskList(list.id)}
                      >
                        Edit
                      </button>
                      {list.id !== 'default' && (
                        <button 
                          className="text-sm text-rose-500 hover:text-rose-700 px-2 py-1 hover:bg-rose-50 rounded"
                          onClick={() => deleteTaskList(list.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="list-body p-4 flex-grow overflow-y-auto max-h-[50vh]">
                    {/* Show add task form when adding to this list */}
                    {addingTaskToListId === list.id ? (
                      <div className="mb-3">
                        <ListAddTask 
                          onAdd={onAddTask}
                          onCancel={() => setAddingTaskToListId(null)}
                          listFilters={list.filters}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddTaskToList(list.id)}
                        className="mb-3 w-full py-2 px-3 flex items-center justify-center text-sm text-neutral-600 hover:text-primary-600 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-dashed border-neutral-300 hover:border-primary-300 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 mr-1.5" />
                        Add task to this list
                      </button>
                    )}
                    
                    <TaskList
                      tasks={filteredTasks}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                    />
                  </div>
                  
                  {/* List action buttons */}
                  {filteredTasks.length > 0 && (
                    <div className="list-actions p-3 border-t border-neutral-100 flex justify-between">
                      <motion.button 
                        onClick={() => handleCompleteListTasks(list.id)} 
                        className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors px-2 py-1 hover:bg-primary-50 rounded-lg"
                        disabled={allTasksCompleted}
                        whileHover={{ scale: allTasksCompleted ? 1 : 1.02 }}
                        whileTap={{ scale: allTasksCompleted ? 1 : 0.98 }}
                      >
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Complete All
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => handleDeleteListCompletedTasks(list.id)} 
                        className="flex items-center text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors px-2 py-1 hover:bg-rose-50 rounded-lg"
                        disabled={!hasCompletedTasks}
                        whileHover={{ scale: !hasCompletedTasks ? 1 : 1.02 }}
                        whileTap={{ scale: !hasCompletedTasks ? 1 : 0.98 }}
                      >
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Clear Completed
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Add new task list button */}
        <motion.button
          className="add-list-button w-full md:w-[calc(50%-0.5rem)] lg:w-80 h-48 rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-300 transition-colors"
          onClick={addTaskList}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="h-10 w-10" />
          <span className="mt-2 font-medium">Add New List</span>
        </motion.button>
      </div>
    </div>
  );
}

export default TaskBoard;