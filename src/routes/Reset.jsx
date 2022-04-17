import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import Spinner from "../components/Spinner";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import "./Login.css";

function Reset() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, _jwtToken] = isAuth();

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const login_url = new URL("/reset/", API_URL).href;
    const request = new Request(login_url, {
      method: "POST",
      body: JSON.stringify({ email }),
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
          if (isLogged) {
            setIsLoading(false);
            setError("you can't reset your password");
            return;
          } else {
            setError("");
            setIsLoading(false);
            setMessage("an email was sent to you");
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
          Reset your <b>Trecker</b> password
        </h1>
        {message && (
          <div className="form-info">
            <p>{message}</p>
          </div>
        )}
        <ErrorModal error={error} callback={setError} />
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

        <button className="button" disabled={isLoading}>
          Reset {isLoading && <Spinner />}
        </button>
      </form>
    </div>
  );
}

export default Reset;
