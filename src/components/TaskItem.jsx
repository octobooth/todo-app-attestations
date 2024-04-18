import React from 'react';

function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className={`task-item flex flex-row items-center my-1 ${task.isCompleted ? 'bg-green-100' : ''}`}>
      <p
        className={`task-text basis-3/4 ${task.isCompleted ? 'line-through' : ''}`}
        onClick={() => toggleTask(task.id)}
      >
        {task.text}
      </p>
      {task.isCompleted && (
        <div>
          <button
            className="delete-btn bg-red-500 text-white rounded p-2"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
