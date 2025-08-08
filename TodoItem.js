import React, { useState } from 'react';

function TodoItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(props.todo.text);
  const [newCategory, setNewCategory] = useState(props.todo.category);
  const [newPriority, setNewPriority] = useState(props.todo.priority);
  const [newDueDate, setNewDate] = useState(props.todo.date);

  const handleEdit = () => {
    if (props.todo.completed) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (newText.trim() !== "") {
      props.onEdit(props.todo.id, newText.trim(), newCategory, newPriority, newDueDate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewText(props.todo.text);
    setNewCategory(props.todo.category);
    setNewPriority(props.todo.priority);
    setNewDate(props.todo.date);
    setIsEditing(false);
  };

  const isOverdue = (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date && date < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));

    const relative =
      daysDiff === 0
        ? ' (Today)'
        : daysDiff > 0
        ? ` (${daysDiff} day${daysDiff > 1 ? 's' : ''} left)`
        : ` (${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? 's' : ''} overdue)`;

    return (
      date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + relative
    );
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={props.todo.completed}
        onChange={() => props.onToggle(props.todo.id)}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Home">Home</option>
            <option value="Personal">Personal</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="priority-select"
          >
            <option value="">Select Level</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </>
      ) : (
        <>
          <div className="todo-content">
            <span className={`
              todo-text
              ${props.todo.completed ? 'completed' : ''}
              ${!props.todo.completed && isOverdue(props.todo.date) ? 'overdue' : ''}
              ${!props.todo.completed && !isOverdue(props.todo.date) ? 'active' : ''}
            `}>
              {props.todo.text}
            </span>
            {props.todo.date && (
              <div className="meta">
                Due: {formatDate(props.todo.date)}
              </div>
            )}
          </div>
          <span className="category-badge">{props.todo.category}</span>
          <span className={`priority-badge ${
            props.todo.priority === 'High' ? 'priority-high'
              : props.todo.priority === 'Medium' ? 'priority-medium'
              : props.todo.priority === 'Low' ? 'priority-low' : ''
          }`}>
            {props.todo.priority}
          </span>
          <button onClick={handleEdit} className="edit-btn">Edit</button>
        </>
      )}
      <button onClick={() => props.onDelete(props.todo.id)} className="delete-btn">Delete</button>
    </li>
  );
}

export default TodoItem;
