import React, { useState } from 'react';

function AddTask({ onAdd }) {
  const [text, setText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onAdd({ text, isCompleted: false });
    setText('');
  };

  return (
    <form className="add-form flex flex-row" onSubmit={onSubmit}>
      <div className="form-control basis-3/4">
        <input
          type="text"
          placeholder="Add New Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input input-bordered w-full max-w-xs h-full"
        />
      </div>
      <div>
        <input type="submit" value="Save Task" className="bg-sky-700 hover:bg-sky-900 text-white rounded p-2" />
      </div>
      </form>
  );
}

export default AddTask;
