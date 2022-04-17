import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import Spinner from "../components/Spinner";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import "./Login.css";
import { useParams } from "react-router-dom";

function ResetPWD() {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, _jwtToken] = isAuth();

  const [newPassword, setNewPassword] = useState("");
  const [newCPassword, setCNewPassword] = useState("");
  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    if (newCPassword !== newPassword) {
      setError("the passwords do not match");
      return;
    }
    setIsLoading(true);
    var login_url = new URL("/resetpwd/", API_URL).href;
    login_url = new URL(resetToken, login_url).href;
    console.log(login_url);
    const request = new Request(login_url, {
      method: "POST",
      body: JSON.stringify({ newpassword: newPassword }),
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
            setError("you can't reset while you are logged in");
            return;
          } else {
            setError("");
            setIsLoading(false);
            setMessage("your password was resetted successfly, please login");
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
          <label htmlFor="newpassword">New password</label>
          <input
            autoComplete="off"
            required
            className="input"
            type="newpassword"
            name="newpassword"
            placeholder="Type in your new password..."
            value={newPassword}
            onInput={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="login-elem">
          <label htmlFor="cnewpassword">Confirm new password</label>
          <input
            autoComplete="off"
            required
            className="input"
            type="cnewpassword"
            name="cnewpassword"
            placeholder="Confirm your new password..."
            value={newCPassword}
            onInput={(e) => setCNewPassword(e.target.value)}
          />
        </div>
        <button className="button" disabled={isLoading}>
          Reset {isLoading && <Spinner />}
        </button>
      </form>
    </div>
  );
}

export default ResetPWD;
