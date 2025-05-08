import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';

function GlobalTaskForm({ onAdd, onCancel, availableTags = [] }) {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Add current tag input if it exists and not already added
    const finalTagInput = newTagInput.trim();
    if (finalTagInput && !selectedTags.includes(finalTagInput)) {
      onAdd({ text, isCompleted: false, tags: [...selectedTags, finalTagInput] });
    } else {
      onAdd({ text, isCompleted: false, tags: selectedTags });
    }
    
    setText('');
    setSelectedTags([]);
    setNewTagInput('');
  };

  const addTag = (tag) => {
    if (!tag.trim() || selectedTags.includes(tag.trim())) return;
    setSelectedTags([...selectedTags, tag.trim()]);
    setNewTagInput('');
  };
  
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Handle input key events (add tag on Enter or comma)
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && newTagInput.trim()) {
      e.preventDefault();
      addTag(newTagInput.trim());
    }
  };

  // Get matching tags based on the current input
  const getMatchingTags = () => {
    if (!newTagInput.trim()) return [];
    
    const inputLower = newTagInput.toLowerCase();
    return availableTags.filter(tag => 
      !selectedTags.includes(tag) && 
      tag.toLowerCase().includes(inputLower)
    );
  };

  return (
    <form className="global-task-form mb-6" onSubmit={onSubmit}>
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full py-3 px-4 pr-24 text-neutral-800 rounded-lg border border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <motion.button
            type="button"
            onClick={onCancel}
            className="p-2 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="submit"
            disabled={!text.trim()}
            className={`p-2 rounded-full ${
              text.trim() 
                ? 'text-primary-600 hover:text-primary-800 hover:bg-primary-50' 
                : 'text-neutral-300 cursor-not-allowed'
            } transition-colors`}
            whileTap={text.trim() ? { scale: 0.9 } : {}}
          >
            <CheckIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Tag input field */}
      <div className="mb-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <TagIcon className="h-4 w-4 text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Enter a new tag (press Enter or comma to add)"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full py-3 px-4 pl-9 text-sm text-neutral-800 rounded-lg border border-neutral-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            autoComplete="off"
          />
          
          {/* Add button */}
          {newTagInput.trim() && !selectedTags.includes(newTagInput.trim()) && (
            <button
              type="button"
              onClick={() => addTag(newTagInput.trim())}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Matching tag suggestions - only shown when input matches existing tags */}
        {getMatchingTags().length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-neutral-500 mb-1.5">Select matching tag:</p>
            <div className="flex flex-wrap gap-2">
              {getMatchingTags().map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="mb-1">
          <p className="text-xs font-medium text-neutral-500 mb-2">Selected tags:</p>
          <div className="flex flex-wrap gap-2 p-2 bg-neutral-50 rounded-lg">
            {selectedTags.map((tag, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-500 text-white group"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                <span>{tag}</span>
                <button
                  type="button"
                  className="ml-1 p-0.5 rounded-full hover:bg-primary-600 group-hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    removeTag(tag);
                  }}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

export default GlobalTaskForm;