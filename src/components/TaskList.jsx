import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="task-list space-y-2">
      <AnimatePresence>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TaskItem 
                task={task} 
                toggleTask={toggleTask} 
                deleteTask={deleteTask} 
              />
            </motion.div>
          ))
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-neutral-500 py-4 font-medium"
          >
            All tasks are complete!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;
