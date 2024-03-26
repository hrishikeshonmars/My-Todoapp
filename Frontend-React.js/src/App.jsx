import { useEffect, useState } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import Search from "./components/Todosearch";
import TodoList from "./components/TodoList";
import Filter from "./components/TodoFilter";

function App() {
  const [todos, setTodos] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/todos")
     .then((res) => setTodos(res.data))
     .catch((err) => setErrors(err.message));
  }, []);

  const addTodo = (data) => {
    const originalTodos = [...todos];
    setTodos([...todos, {...data, id: parseInt(todos[todos.length - 1]?.id || 0) + 1, status: "Active" }]);
    axios.post("http://127.0.0.1:8000/todos", data)
     .then((res) => setTodos([...todos, res.data]))
     .catch((err) => {
        setErrors(err.message);
        setTodos(originalTodos);
      });
  };

  
  const delTodo = (id) => {
    const originalTodos = [...todos];
    setTodos((todos) => todos.filter((todo) => todo.id!== id));
    axios.delete("http://127.0.0.1:8000/todos" + id)
     .catch((err) => {
        setErrors(err.message);
        setTodos(originalTodos);
      });
  };

  
  const updateTodo = (e, id, text, todo) => {
    e.preventDefault();
    const updatedUser = {...todo, task: text, status: "Active" };
    setTodos((todos) => todos.map((t) => (t.id === todo.id? updatedUser : t)));
    const UpdateTodo = {...todo, task: text };
    axios.patch("http://127.0.0.1:8000/todos" + id, UpdateTodo)
     .catch((err) => setErrors(err.message));
  };

  const completeTodo = (e, id, todo) => {
    if (e.target.checked) {
      console.log("okay");
      setTodos((todos) => todos.map((todo) => (todo.id === id? {...todo, completed: true } : todo)));
      const UpdateTodo = {...todo, completed: true };
      axios.patch("http://127.0.0.1:8000/todos" + id, UpdateTodo)
       .catch((err) => setErrors(err.message));
    } else {
      console.log("omo");
      setTodos((todos) => todos.map((todo) => (todo.id === id? {...todo, completed: false } : todo)));
      const UpdateTodo = {...todo, completed: false };
      axios.patch("http://127.0.0.1:8000/todos" + id, UpdateTodo)
       .catch((err) => setErrors(err.message));
    }
  };

  const filterTodo = (cat_value) => {
    setTodos((todos) => todos.filter((todo) => todo.status === cat_value));
  };

  return (
    <div className="todo-container">
      {errors && <p>{errors}</p>}
      <Search addTodo={addTodo} />
      <Filter filter_todo={filterTodo} />
      <TodoList
        todos={todos}
        delTodo={delTodo}
        update_todo={updateTodo}
        complete_todo={completeTodo}
        filter_todo={filterTodo}
      />
    </div>
  );
}

export default App;