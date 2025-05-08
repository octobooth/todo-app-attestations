import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';

function GlobalTaskForm({ onAdd, onCancel, availableTags = [] }) {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const inputRef = useRef(null);
  const tagInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Auto-focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAdd({ text, isCompleted: false, tags: selectedTags });
    setText('');
    setSelectedTags([]);
    setNewTagInput('');
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addNewTag = () => {
    const tagToAdd = newTagInput.trim();
    if (!tagToAdd) return;
    
    if (!selectedTags.includes(tagToAdd)) {
      setSelectedTags([...selectedTags, tagToAdd]);
    }
    
    setNewTagInput('');
  };

  // Filter available tags based on search input
  const getFilteredAvailableTags = () => {
    const searchLower = newTagInput.toLowerCase();
    return availableTags.filter(tag => 
      !selectedTags.includes(tag) && 
      tag.toLowerCase().includes(searchLower)
    );
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && 
        tagInputRef.current && !tagInputRef.current.contains(e.target)) {
      setShowTagSelector(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      
      {/* Tag selector */}
      <div className="relative mb-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <TagIcon className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          ref={tagInputRef}
          type="text"
          placeholder={selectedTags.length > 0 ? "Add more tags..." : "Add tags (e.g. work, urgent)"}
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onFocus={() => setShowTagSelector(true)}
          className="w-full py-3 px-4 pl-9 text-sm text-neutral-800 rounded-lg border border-neutral-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
          autoComplete="off"
        />
        
        {/* Tag selector dropdown */}
        {showTagSelector && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-64 overflow-y-auto"
          >
            <div className="py-1">
              <div className="sticky top-0 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
                <span className="text-sm font-medium text-neutral-700">Select Tags</span>
              </div>
              
              {/* Add new tag option */}
              {newTagInput.trim() && !availableTags.includes(newTagInput.trim()) && !selectedTags.includes(newTagInput.trim()) && (
                <div
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-neutral-100"
                  onClick={addNewTag}
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium text-green-700">Create tag: "{newTagInput.trim()}"</span>
                  </div>
                </div>
              )}
              
              {/* Existing tags list */}
              {getFilteredAvailableTags().length > 0 ? (
                <div className="py-1">
                  {getFilteredAvailableTags().map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 text-sm hover:bg-primary-50 cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-2.5 text-primary-600" />
                        <span className="font-medium text-neutral-800">{tag}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary-50 rounded text-primary-700">Click to add</span>
                    </div>
                  ))}
                </div>
              ) : newTagInput && (
                <div className="px-4 py-4 text-sm text-neutral-500 text-center">
                  No matching tags
                </div>
              )}
              
              {!newTagInput && availableTags.length === 0 && (
                <div className="px-4 py-4 text-sm text-neutral-500 text-center">
                  No tags available. Type to create a new tag.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="mb-1">
          <p className="text-xs text-neutral-500 mb-2">Selected tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 group"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                <span>{tag}</span>
                <button
                  type="button"
                  className="ml-1 p-0.5 rounded-full hover:bg-primary-200 group-hover:text-primary-800"
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