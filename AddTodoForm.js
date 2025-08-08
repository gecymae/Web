import React, { useState } from 'react';

function AddTodoForm(props) {
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [inputPriority, setInputPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = inputCategory === 'Other' ? customCategory.trim() : inputCategory;

    if (inputText.trim() !== '' && category !== '') {
      props.onAddTodo(inputText.trim(), category, inputPriority, dueDate);
      setInputText('');
      setInputCategory('');
      setCustomCategory('');
      setInputPriority('');
      setDueDate('');
    }
  };

  return (
    <div className="add-form">
      <form onSubmit={handleSubmit} className="add-todo-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What should we do?"
          className="todo-input"
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value)}
          className="category-select"
          required
        >
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="School">School</option>
          <option value="Home">Home</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>

        {inputCategory === 'Other' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter custom category"
            className="todo-input"
            required
          />
        )}

        <select
          value={inputPriority}
          onChange={(e) => setInputPriority(e.target.value)}
          className="priority-select"
        >
          <option value="">Select Level</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="submit" className="add-btn">Add To-Do</button>
      </form>
    </div>
  );
}

export default AddTodoForm;
