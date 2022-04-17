import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import { API_URL } from "../CONSTANTS";
import { IconCheck, IconX } from "@tabler/icons";
import "./Todo.css";
import { IconTrash } from "@tabler/icons";
import { IconPencil } from "@tabler/icons";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import rehypeSanitize from "rehype-sanitize";

function Todo() {
  const { todoId } = useParams();
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(true);
  const [logged, token] = isAuth("jwt_token");
  const [exist, setExist] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const get_url = new URL("/todo/" + todoId, API_URL);
    const request = new Request(get_url, {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json) {
          setExist(true);
          setTodo(json);
          setLoading(false);
        } else {
          setExist(false);
        }
      })

      .catch((err) => console.error(err));
  }, []);

  const updateChecked = (checked) => {
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
        todoId,
        ...newtodo,
        checked,
      }),
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        setTodo(json);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((err) => console.error(err));
  };
  const deleteCard = () => {
    setError("");
    setLoading(true);
    if (!confirm("Are you sure?")) {
      setLoading(false);
      return;
    }
    const get_url = new URL("/todo/", API_URL);
    const request = new Request(get_url, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        todoId,
      }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "OK") {
          navigate("/");
        } else {
          setError(json.message);
        }
      })
      .catch((err) => setError(err.message));
    setLoading(false);
  };

  {
    if (exist) {
      return (
        <div className="todo-container">
          <ErrorModal error={error} callback={setError} />
          {logged && (
            <div className="todo">
              <div className="intro">
                <h1
                  className={`todo-title ${todo.checked ? "checked line" : ""}`}
                >
                  {todo.title}
                </h1>
                <div className={`todo-icons ${loading ? "loading" : ""}`}>
                  {loading && (
                    <div className="spinner-container">
                      <Spinner dark={true} />
                    </div>
                  )}
                  <div
                    className="todo-icon"
                    onClick={() => {
                      updateChecked(!todo.checked);
                    }}
                  >
                    {todo.checked ? <IconX /> : <IconCheck />}
                  </div>
                  <div
                    className="todo-icon"
                    onClick={() => {
                      navigate("/edit/" + todoId);
                    }}
                  >
                    <IconPencil />
                  </div>
                  <div className="todo-icon" onClick={deleteCard}>
                    <IconTrash />
                  </div>
                </div>
              </div>
              <div className="separator"></div>
              <div className={`todo-preview ${todo.checked ? "checked" : ""}`}>
                <MDEditor.Markdown
                  rehypePlugins={[[rehypeSanitize]]}
                  source={todo.content ? todo.content : "No content available"}
                />
              </div>
              <span className="todo-date">
                {new Date(todo.dueDate).toUTCString()}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="todo-container">
          <h1>TODO doesn't exist</h1>
        </div>
      );
    }
  }
}

export default Todo;
