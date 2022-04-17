import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { API_URL } from "../CONSTANTS";

import TodoCard from "../components/TodoCard";
import isAuth from "../../hooks/isAuth";

import "./Home.css";
import { IconPlus } from "@tabler/icons";

function AuthComponent() {
  return (
    <div className="auth">
      <h1>Choose one of these options:</h1>
      <Link to={"/login"} className="link">
        <button type="button" className="button">
          Log In
        </button>
      </Link>
      <Link to={"/signup"} className="link">
        <button type="button" className="button">
          Sign Up
        </button>
      </Link>
    </div>
  );
}
function HomeComponent({ token }) {

  const url = new URL("/me/", API_URL);
  const [user, setUser] = useState({});
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(url, {
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json);
        setTodos(json.todos);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="intro">
        <h1 className="greeting">Hello again, {user.firstname}</h1>
        <Link className="link add" to={"/new/"}>
          <IconPlus />
        </Link>
      </div>
      <div className="separator"></div>
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
  );
}
function Home() {
  const [isLogged, _jwtToken] = isAuth();

  return (
    <div>
      {!isLogged && <AuthComponent />}
      {isLogged && <HomeComponent token={_jwtToken} />}
    </div>
  );
}

export default Home;
