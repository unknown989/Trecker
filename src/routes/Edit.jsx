import "./New.css";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { API_URL } from "../CONSTANTS";
import isAuth from "../../hooks/isAuth";
import { useState } from "react";
import ErrorModal from "../components/ErrorModal";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function New() {
  const { todoId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [_isLogged, token] = isAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exist, setExist] = useState(false);
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
        if (json.message === undefined) {
          setExist(true);
          setTitle(json.title);
          setContent(json.content);
          setDate(new Date(json.dueDate).toISOString().slice(0, 19));
          setLoading(false);
        } else {
          setExist(false);
        }
      })

      .catch((err) => console.error(err));
  }, []);

  const saveTodo = (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    const new_url = new URL("/update/todo", API_URL).href;
    const request = new Request(new_url, {
      method: "post",
      body: JSON.stringify({
        id: todoId,
        title,
        content,
        dueDate: new Date(date).toISOString(),
      }),
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json) {
          setError("");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setError(json.message);
        }
      })
      .catch((err) => setError(err.message));
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <form className="new-container" onSubmit={saveTodo}>
      <ErrorModal error={error} callback={setError} />
      <h1>Modify your To-Do</h1>
      <div className="separator"></div>
      <div className="new-elem">
        <p>Title:</p>
        <input
          required
          type="text"
          className="input"
          placeholder="type in a title..."
          value={title}
          onInput={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="new-elem">
        <p>Additional Content:</p>
        <MDEditor
          required
          value={content}
          onChange={setContent}
          previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        />
      </div>
      <div className="new-elem">
        <p>Due Date:</p>
        <input
          required
          type="datetime-local"
          className="input"
          value={date}
          onInput={(e) => {
            setDate(e.target.value);
          }}
        />
      </div>
      <div className="new-elem">
        <button className={`button ${loading && "loading"}`}>
          {loading ? <Spinner /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default New;
