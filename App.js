import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dueDateSortAsc, setDueDateSortAsc] = useState(true);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedNextId = localStorage.getItem('nextId');

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('nextId', nextId.toString());
  }, [nextId]);

  const addTodo = (text, inputCategory, inputPriority, dueDate) => {
    const newTodo = {
      id: nextId,
      text,
      completed: false,
      category: inputCategory || 'Personal',
      priority: inputPriority || '',
      date: dueDate || ''
    };
    setTodos([...todos, newTodo]);
    setNextId(nextId + 1);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const editTodo = (id, newText, newCategory, newPriority, newDueDate) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: newText,
            category: newCategory,
            priority: newPriority,
            date: newDueDate
          }
        : todo
    ));
  };

  const isOverdue = (todo) => {
    if (!todo.date) return false;
    const today = new Date().setHours(0,0,0,0);
    const due = new Date(todo.date).setHours(0,0,0,0);
    return due < today;
  };

  const filterTodos = () => {
    return todos.filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || todo.category === filterCategory;
      let matchesStatus = true;

      if (filterStatus === 'Active') matchesStatus = !todo.completed && !isOverdue(todo);
      else if (filterStatus === 'Completed') matchesStatus = todo.completed;
      else if (filterStatus === 'Overdue') matchesStatus = !todo.completed && isOverdue(todo);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const sortedTodos = [...filterTodos()].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3, '': 4 };
    const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityComparison !== 0) return priorityComparison;

    if (a.date && b.date) {
      return dueDateSortAsc ? (new Date(a.date) - new Date(b.date)) : (new Date(b.date) - new Date(a.date));
    } else if (a.date && !b.date) {
      return -1;
    } else if (!a.date && b.date) {
      return 1;
    } else {
      return 0;
    }
  });

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const toggleDueDateSort = () => setDueDateSortAsc(!dueDateSortAsc);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My TODO App</h1>
      </header>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="All">All Categories</option>
          {[...new Set(todos.map(t => t.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button onClick={toggleDueDateSort} className="sort-btn">
          Sort by Due Date {dueDateSortAsc ? '↑' : '↓'}
        </button>
        <button onClick={toggleAddForm} className="add-btn">
          {showAddForm ? 'Hide' : 'Add To-Do'}
        </button>
      </div>

      {showAddForm && <AddTodoForm onAddTodo={addTodo} />}

      {sortedTodos.length === 0 ? (
        <p className="no-todos">No items found matching your filters.</p>
      ) : (
        <div className="todo-container">
          <ul className="todo-list">
            {sortedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                isOverdue={isOverdue(todo)}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="todo-stats">
        <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  );
}

export default App;
