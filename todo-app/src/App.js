import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class TodoApp extends React.Component {
  state = {
    todoList: [],
    userInput: '',
    editingTodoId: null,
  };


  componentDidMount() {
    const storedTodoList = JSON.parse(localStorage.getItem('todoList'));
    if (storedTodoList) {
      this.setState({ todoList: storedTodoList });
    }
  }

  handleAddTodo = () => {
    const { userInput, todoList } = this.state;

    if (userInput.trim() === '') {
      alert('Enter Valid Text');
      return;
    }

    const newTodo = {
      text: userInput,
      uniqueNo: Date.now(),
      isChecked: false,
      isEditing: false,
    };

    this.setState({
      todoList: [...todoList, newTodo],
      userInput: '',
    });
  };

  handleTodoStatusChange = (todoId) => {
    const updatedTodoList = this.state.todoList.map((todo) =>
      todo.uniqueNo === todoId ? { ...todo, isChecked: !todo.isChecked } : todo
    );

    this.setState({ todoList: updatedTodoList });
  };

  handleDeleteTodo = (todoId) => {
    const updatedTodoList = this.state.todoList.filter(
      (todo) => todo.uniqueNo !== todoId
    );

    this.setState({ todoList: updatedTodoList });
  };

  handleEditTodo = (todoId) => {
    const updatedTodoList = this.state.todoList.map((todo) =>
      todo.uniqueNo === todoId ? { ...todo, isEditing: true } : todo
    );

    this.setState({ todoList: updatedTodoList, editingTodoId: todoId });
  };

  handleSaveEdit = (todoId, newText) => {
    const updatedTodoList = this.state.todoList.map((todo) =>
      todo.uniqueNo === todoId ? { ...todo, text: newText, isEditing: false } : todo
    );

    this.setState({ todoList: updatedTodoList, editingTodoId: null });
  };

  handleSaveTodos = () => {
    localStorage.setItem('todoList', JSON.stringify(this.state.todoList));
  };

  render() {
    const { todoList, userInput, editingTodoId } = this.state;

    return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">Todo List</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => this.setState({ userInput: e.target.value })}
            placeholder="Enter a todo"
            className="form-control"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              onClick={this.handleAddTodo}
            >
              Add Todo
            </button>
          </div>
        </div>
        <ul id="todoItemsContainer" className="list-group">
          {todoList.map((todo) => (
            <li
              key={todo.uniqueNo}
              id={`todo${todo.uniqueNo}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  id={`checkbox${todo.uniqueNo}`}
                  checked={todo.isChecked}
                  onChange={() => this.handleTodoStatusChange(todo.uniqueNo)}
                  className="mr-2"
                />
                {todo.isEditing ? (
                  <input
                    type="text"
                    defaultValue={todo.text}
                    onBlur={(e) =>
                      this.handleSaveEdit(todo.uniqueNo, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        this.handleSaveEdit(todo.uniqueNo, e.target.value);
                      }
                    }}
                    className="form-control"
                  />
                ) : (
                  <label
                    htmlFor={`checkbox${todo.uniqueNo}`}
                    id={`label${todo.uniqueNo}`}
                    className={`mb-0 ${
                      todo.isChecked ? 'text-decoration-line-through' : ''
                    }`}
                  >
                    {todo.text}
                  </label>
                )}
              </div>
              <div>
                {!todo.isEditing && (
                  <i
                    className="fas fa-edit mr-3 text-primary"
                    onClick={() => this.handleEditTodo(todo.uniqueNo)}
                  ></i>
                )}
                <i
                  className="fas fa-trash-alt text-danger"
                  onClick={() => this.handleDeleteTodo(todo.uniqueNo)}
                ></i>
              </div>
            </li>
          ))}
        </ul>
        <button
          id="saveTodoButton"
          className="btn btn-success mt-3"
          onClick={this.handleSaveTodos}
        >
          Save Todos
        </button>
      </div>
    );
  }
}

export default TodoApp;
