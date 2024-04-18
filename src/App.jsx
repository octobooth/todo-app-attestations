import React, { useState } from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    const id = Math.floor(Math.random() * 10000) + 1;
    const newTask = { id, ...task };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completeAllTasks = () => {
    setTasks(tasks.map(task => ({ ...task, isCompleted: true })));
  };

  const deleteCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.isCompleted));
  };

  return (
    <div className="App bg-slate-300 h-screen text-center">
      <header className="App-header">
        <h1 className="text-4xl py-5">Todo List</h1>
        <AddTask onAdd={addTask} />
        <button className="bg-green-500 bg-green-700 my-3 mx-2 text-white p-2 rounded" onClick={completeAllTasks}>Complete All</button>
        <button className="bg-red-500 bg-red-700 my-3 mx-2 text-white p-2 rounded" onClick={deleteCompletedTasks}>Delete Completed</button>
        <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </header>
    </div>
  );
}

export default App;
