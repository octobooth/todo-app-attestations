import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';

function AddTask({ onAdd, onCancel, availableTags = [] }) {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const inputRef = useRef(null);
  const tagInputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Process tags - split by commas and trim each tag
    const tagArray = tags.trim() 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
      : [];
    
    onAdd({ text, isCompleted: false, tags: tagArray });
    setText('');
    setTags('');
  };

  const handleTagSelect = (tag) => {
    // Get current tags as an array
    const currentTags = tags.trim() 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
      
    // Check if tag is already in the list
    if (!currentTags.includes(tag)) {
      const newTagsString = currentTags.length > 0
        ? `${tags.trim()}, ${tag}`
        : tag;
      
      setTags(newTagsString);
    }
    
    setShowTagSuggestions(false);
    // Focus back on the tag input
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };
  
  // Filter available tags that haven't been selected yet
  const getFilteredTags = () => {
    if (!tags.trim()) return availableTags;
    
    const currentTags = tags.split(',').map(t => t.trim());
    const lastTag = currentTags[currentTags.length - 1].toLowerCase();
    
    return availableTags.filter(tag => 
      !currentTags.includes(tag) && 
      tag.toLowerCase().includes(lastTag)
    );
  };

  return (
    <form className="add-form mb-6" onSubmit={onSubmit}>
      <div className="relative mb-2">
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
      
      {/* Tag input field with suggestions */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <TagIcon className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          ref={tagInputRef}
          type="text"
          placeholder="Add tags (comma separated, e.g. work, urgent)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onFocus={() => setShowTagSuggestions(true)}
          onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
          className="w-full py-2 px-4 pl-9 text-sm text-neutral-800 rounded-lg border border-neutral-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
          autoComplete="off"
        />
        
        {/* Tag suggestions dropdown - improved visibility */}
        {showTagSuggestions && availableTags.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-xl border border-neutral-200 max-h-56 overflow-y-auto">
            <div className="py-1">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <span className="text-xs font-medium text-neutral-600">Available Tags</span>
              </div>
              
              {getFilteredTags().length > 0 ? (
                getFilteredTags().map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2.5 text-sm hover:bg-primary-50 cursor-pointer transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleTagSelect(tag);
                    }}
                  >
                    <TagIcon className="h-3.5 w-3.5 mr-2 text-primary-600" />
                    <span className="font-medium text-neutral-700">{tag}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-3 text-sm text-neutral-500 text-center">
                  No matching tags
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default AddTask;
