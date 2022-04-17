import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import Spinner from "../components/Spinner";
import TodoCard from "../components/TodoCard";
import "./Profile.css";
import { IconPencil } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
import { Link } from "react-router-dom";

function Profile() {
  const [picture, setPicture] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [todos, setTodos] = useState([]);
  const [logged, token] = isAuth("jwt_token");
  const [exist, setExist] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!logged) {
    navigate("/");
  }
  useEffect(() => {
    setLoading(true);
    setError("");
    setExist(false);
    const get_url = new URL("/me/", API_URL);
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
        console.log(json);
        if (json.message === undefined) {
          if (json) {
            setExist(true);
            setPicture(json.image);
            setEmail(json.email);
            setFirstname(json.firstname);
            setLastname(json.lastname);
            setTodos(json.todos);
            setId(json.id);
          } else {
            setExist(false);
          }
        } else {
          setError(json.message);
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => setError(err.message));
  }, []);

  const deleteUser = () => {
    setError("");
    setLoading(true);
    if (!confirm("Are you sure?")) {
      setLoading(false);
      return;
    }
    const get_url = new URL("/me/", API_URL);
    const request = new Request(get_url, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id,
      }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "OK") {
          navigate("/");
          localStorage.removeItem("jwt_token");
        } else {
          setError(json.message);
        }
      })
      .catch((err) => setError(err.message));
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <ErrorModal callback={setError} error={error} />
      {exist ? (
        <div className="profile">
          {loading ? (
            <div className="loading-spin">
              <Spinner dark big />
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-image">
                <img
                  draggable={false}
                  src={picture}
                  className="profile-image-img"
                />
              </div>
              <div className="todo-icons">
                <Link className="link" to={"/profile/"}>
                  <IconPencil className="todo-icon" />
                </Link>
                <IconTrash className="todo-icon" onClick={deleteUser} />
              </div>
              <div className="profile-name">
                {firstname} {lastname}
              </div>
              <div className="profile-email">{email}</div>
              <div className="todos-container">
                {(function () {
                  if (todos.length > 0) {
                    return [...todos].map((todo) => {
                      return <TodoCard key={todo.id} tododata={todo} />;
                    });
                  } else {
                    return "No TODOs available";
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>This user does not exist</div>
      )}
    </div>
  );
}

export default Profile;
