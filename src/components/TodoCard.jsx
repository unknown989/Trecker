import { IconExternalLink } from "@tabler/icons";
import { IconBug } from "@tabler/icons";
import { IconCheck } from "@tabler/icons";
import { IconX } from "@tabler/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import { API_URL } from "../CONSTANTS";
import Spinner from "./Spinner";
import "./TodoCard.css";

function TodoCard({ tododata }) {
  const [todo, setTodo] = useState(tododata);
  const [todoChecked, setTodoChecked] = useState(tododata.checked);
  const [loading, setLoading] = useState(false);
  const [isLogged, token] = isAuth();
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const updateChecked = (_checked) => {
    setLoading(true);
    const get_url = new URL("/update/todo/", API_URL);
    const newtodo = todo;
    delete newtodo.checked;
    const request = new Request(get_url, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...newtodo,
        checked: _checked,
      }),
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json.message === undefined) {
          setError("");
          setTodo(json);
          setTodoChecked(json.checked);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else {
          setLoading(false);
          setError(json.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError(err.message);
      });
  };

  const openCard = () => {
    navigate(`/todo/${todo.id}`);
  };
  return (
    <div className={`todo ${todoChecked ? "checked" : ""}`}>
      <div className="todo-title">
        <p>
          {todo.title.length > 14
            ? todo.title.slice(0, 14) + "..."
            : todo.title}
        </p>
      </div>
      <div className="todo-date">
        <p>{new Date(todo.dueDate).toLocaleString()}</p>
      </div>
      <div className="todo-icons">
        <div
          className="todo-icon"
          onClick={() => {
            updateChecked(!todoChecked);
          }}
        >
          {(() => {
            if (loading) {
              return <Spinner dark={true} />;
            } else {
              if (todoChecked) {
                return <IconX />;
              } else {
                return <IconCheck />;
              }
            }
          })()}
        </div>
        <div className="todo-icon" onClick={openCard}>
          <IconExternalLink />
        </div>
        {error && (
          <div className="todo-icon">
            <IconBug
              color="#d55"
              onMouseEnter={() => {
                setShowError(true);
              }}
              onMouseLeave={() => {
                setShowError(false);
              }}
            />
            <div className="error-modal" hidden={!showError}>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoCard;
