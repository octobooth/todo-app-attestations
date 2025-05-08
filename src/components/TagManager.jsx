import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

function TagManager({ tags, onAddTag, onEditTag, onDeleteTag, onClose }) {
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [editedTagName, setEditedTagName] = useState('');

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    onAddTag(newTagName.trim());
    setNewTagName('');
  };

  const startEditingTag = (tag) => {
    setEditingTag(tag);
    setEditedTagName(tag);
  };

  const saveEditedTag = (originalTag) => {
    if (!editedTagName.trim()) return;
    onEditTag(originalTag, editedTagName.trim());
    setEditingTag(null);
    setEditedTagName('');
  };

  const handleDeleteTag = (tag) => {
    onDeleteTag(tag);
  };

  return (
    <div className="tag-manager bg-white rounded-xl shadow-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-neutral-800">Manage Tags</h3>
        <button
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Add new tag */}
      <div className="mb-5">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <TagIcon className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Add a new tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full py-2 px-4 pl-9 text-sm text-neutral-800 rounded-lg border border-neutral-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>
          <motion.button
            onClick={handleAddTag}
            whileTap={{ scale: 0.95 }}
            disabled={!newTagName.trim()}
            className={`px-3 py-2 rounded-lg ${
              newTagName.trim() 
              ? 'bg-primary-500 text-white hover:bg-primary-600' 
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            } transition-colors`}
          >
            <PlusIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Tag list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tags.length === 0 ? (
          <p className="text-center text-neutral-500 py-3">No tags yet</p>
        ) : (
          tags.map((tag, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {editingTag === tag ? (
                <input
                  type="text"
                  value={editedTagName}
                  onChange={(e) => setEditedTagName(e.target.value)}
                  className="w-full py-1 px-2 text-sm border border-primary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 text-primary-600 mr-2" />
                  <span className="text-neutral-800">{tag}</span>
                </div>
              )}
              
              <div className="flex gap-1">
                {editingTag === tag ? (
                  <>
                    <motion.button
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
                      onClick={() => saveEditedTag(tag)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-full"
                      onClick={() => setEditingTag(null)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-full"
                      onClick={() => startEditingTag(tag)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full"
                      onClick={() => handleDeleteTag(tag)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TagManager;