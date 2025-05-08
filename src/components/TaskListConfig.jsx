import React, { useState } from 'react';
import { XMarkIcon, CheckIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';

function TaskListConfig({ taskList, availableTags, onSave, onCancel }) {
  const [title, setTitle] = useState(taskList.title);
  const [filters, setFilters] = useState(taskList.filters || []);

  const handleAddTagFilter = (tag) => {
    // Check if the tag is already in filters
    if (filters.some(f => f.type === 'tag' && f.value === tag)) return;
    
    // Add the tag filter
    setFilters([...filters, { type: 'tag', value: tag }]);
  };

  const handleAddCompletionFilter = (isCompleted) => {
    // Remove any existing completion filter
    const updatedFilters = filters.filter(f => f.type !== 'completed');
    
    // Add the new completion filter
    setFilters([...updatedFilters, { type: 'completed', value: isCompleted }]);
  };

  const removeFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleSave = () => {
    onSave({ title, filters });
  };

  return (
    <div className="task-list-config p-4">
      <h3 className="font-medium text-lg mb-4">Configure List</h3>
      
      {/* List title input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-1">List Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Enter list title"
        />
      </div>
      
      {/* Current filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-1">Current Filters</label>
        
        {filters.length === 0 ? (
          <p className="text-sm text-neutral-500">No filters applied. This list will show all tasks.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div key={index} className="inline-flex items-center bg-neutral-100 px-3 py-1 rounded-full text-sm">
                {filter.type === 'tag' && (
                  <span>Tag: {filter.value}</span>
                )}
                {filter.type === 'completed' && (
                  <span>Status: {filter.value ? 'Completed' : 'Active'}</span>
                )}
                <button 
                  onClick={() => removeFilter(index)}
                  className="ml-1 text-neutral-500 hover:text-neutral-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add tag filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-1">Filter by Tag</label>
        {availableTags.length === 0 ? (
          <p className="text-sm text-neutral-500">No tags available. Add tags to tasks first.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTagFilter(tag)}
                disabled={filters.some(f => f.type === 'tag' && f.value === tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                  ${filters.some(f => f.type === 'tag' && f.value === tag)
                    ? 'bg-primary-200 text-primary-700 opacity-50 cursor-not-allowed'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Add completion filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-1">Filter by Status</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleAddCompletionFilter(false)}
            disabled={filters.some(f => f.type === 'completed' && f.value === false)}
            className={`px-3 py-1 rounded-md text-sm font-medium 
              ${filters.some(f => f.type === 'completed' && f.value === false)
                ? 'bg-blue-200 text-blue-700 opacity-50 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => handleAddCompletionFilter(true)}
            disabled={filters.some(f => f.type === 'completed' && f.value === true)}
            className={`px-3 py-1 rounded-md text-sm font-medium 
              ${filters.some(f => f.type === 'completed' && f.value === true)
                ? 'bg-green-200 text-green-700 opacity-50 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
          >
            Completed Tasks
          </button>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TaskListConfig;