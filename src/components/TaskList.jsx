import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="task-list">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
        ))
      ) : (
        <p className="text-center text-gray-800 font-semibold">All tasks are complete!</p>
      )}
    </div>
  );
}

export default TaskList;
