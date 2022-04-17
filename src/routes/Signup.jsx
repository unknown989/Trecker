import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import Spinner from "../components/Spinner";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import "./Signup.css";
import { useEffect } from "react";

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, _jwtToken] = isAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  useEffect(()=>{
    if (isLogged) {
      navigate("/");
    }
  },[])
  function handleSubmit(e) {
    e.preventDefault();
    if (cpassword !== password) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const signup_url = new URL("/user/", API_URL).href;
    const image =
      "https://ui-avatars.com/api/?name=" + firstname + "+" + lastname;
    const request = new Request(signup_url, {
      method: "POST",
      body: JSON.stringify({ email, password, firstname, lastname, image }),
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
            setError("you're still logged in, log out first");
            return;
          } else {
            setError("");
            setMessage(
              "Your account has been created, please wait while you're being redirected to login"
            );
            setTimeout(() => {
              navigate("/login");
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
    <div className="signup-container">
      <form
        onSubmit={handleSubmit}
        encType="application/x-www-form-urlencoded"
        className="signup-form"
      >
        <h1>
          Create an <b>Trecker</b>'s account
        </h1>
        {message && (
          <div className="form-info">
            <p>{message}</p>
          </div>
        )}
        <ErrorModal error={error} callback={setError}/>
        <div className="signup-elem">
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
        <div className="signup-elem">
          <label htmlFor="firstname">Firstname</label>
          <input
            autoComplete="off"
            required
            className="input"
            type="firstname"
            name="firstname"
            placeholder="Type in your firstname..."
            value={firstname}
            onInput={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="signup-elem">
          <label htmlFor="firstname">Lastname</label>
          <input
            autoComplete="off"
            required
            className="input"
            type="lastname"
            name="lastname"
            placeholder="Type in your lastname..."
            value={lastname}
            onInput={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="signup-elem">
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
        <div className="signup-elem">
          <label htmlFor="password">Confirm password</label>
          <input
            className="input"
            required
            type="password"
            name="password"
            placeholder="Type in your password..."
            minLength={8}
            value={cpassword}
            onInput={(e) => setCPassword(e.target.value)}
          />
        </div>
        <div className="signup-elem-check">
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
        <button className="button" disabled={isLoading}>
          Create an account {isLoading && <Spinner />}
        </button>
      </form>
    </div>
  );
}

export default Signup;
