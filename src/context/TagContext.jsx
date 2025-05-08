import React, { createContext, useState, useContext } from 'react';
import { useTaskContext } from './TaskContext';

// Create the tag context
const TagContext = createContext();

// Custom hook for using tag context
export const useTagContext = () => useContext(TagContext);

// Tag provider component
export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const { tasks } = useTaskContext();

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const editTag = (oldTag, newTag) => {
    // Update the tag in our tags list
    setTags(tags.map(tag => tag === oldTag ? newTag : tag));
    
    // The task updates will be handled inside the TaskContext
  };

  const deleteTag = (tagToDelete) => {
    // Remove the tag from our tags list
    setTags(tags.filter(tag => tag !== tagToDelete));
    
    // The task updates will be handled inside the TaskContext
  };

  const handleManageTags = (operation, oldTag, newTag = null) => {
    switch (operation) {
      case 'add':
        addTag(oldTag);
        break;
        
      case 'edit':
        editTag(oldTag, newTag);
        break;
        
      case 'delete':
        deleteTag(oldTag);
        break;
        
      default:
        break;
    }
  };

  return (
    <TagContext.Provider
      value={{
        tags,
        addTag,
        editTag,
        deleteTag,
        handleManageTags
      }}
    >
      {children}
    </TagContext.Provider>
  );
};