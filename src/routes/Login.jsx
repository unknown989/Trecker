import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import Spinner from "../components/Spinner";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, _jwtToken] = isAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if (isLogged) {
      navigate("/");
    }
  },[])
  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const login_url = new URL("/login/", API_URL).href;
    const request = new Request(login_url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.status === "BAD") {
          setIsLoading(false);
          setError(json.message);
          return;
        } else {
          const token = json.message.token;
          if (isLogged) {
            setIsLoading(false);
            setError("you're still logged in, log out first");
            return;
          } else {
            localStorage.setItem("jwt_token", token);
            setError("");
            setMessage(
              "You're logged in, please wait while you're being redirected"
            );
            setTimeout(() => {
              navigate("/");
            }, 2000);
            return;
          }
        }
      })
      .catch((e) => {
        setError(e.message);
        console.error(e);
        setIsLoading(false);
      });
  }

  return (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        encType="application/x-www-form-urlencoded"
        className="login-form"
      >
        <h1>
          Login to <b>Trecker</b>
        </h1>
        {message && (
          <div className="form-info">
            <p>{message}</p>
          </div>
        )}
        <ErrorModal error={error} callback={setError}/>
        <div className="login-elem">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="off"
            required
            className="input"
            type="email"
            name="email"
            placeholder="Type in your email..."
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-elem">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            required
            type="password"
            name="password"
            placeholder="Type in your password..."
            minLength={8}
            value={password}
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-elem-check">
          <input
            className="checkbox"
            defaultChecked={false}
            type="checkbox"
            id="verify"
            required
          />
          <label htmlFor="verify">
            I accept the terms of usage and conditions
          </label>
        </div>
        <div className="login-elem">
          <p>Forgot your password? <Link to="/reset/">Click here</Link></p>
        </div>
        <button className="button" disabled={isLoading}>
          Login {isLoading && <Spinner />}
        </button>
      </form>
    </div>
  );
}

export default Login;
