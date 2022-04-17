import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import Spinner from "../components/Spinner";
import { API_URL } from "../CONSTANTS";
import ErrorModal from "../components/ErrorModal";
import "./ProfileEdit.css";

function ProfileEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLogged, _jwtToken] = isAuth("jwt_token");

  const [profileImage, setProfileImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLogged) {
      navigate("/");
    }
    setIsLoading(true);
    setError("");
    const get_url = new URL("/me/", API_URL);
    const request = new Request(get_url, {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + _jwtToken,
      },
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json.message === undefined) {
          if (json) {
            setProfileImage(json.image);
            setEmail(json.email);
            setFirstname(json.firstname);
            setLastname(json.lastname);
          } else {
            setError("Profile Probably doesn't exist");
          }
        } else {
          setError(json.message);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => setError(err.message));
  }, []);
  const update = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    const post_url = new URL("/update/me/", API_URL);
    const request = new Request(post_url, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + _jwtToken,
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        image: profileImage,
      }),
    });
    fetch(request)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === undefined) {
          if (json) {
            setMessage("Your profile has been updated");
          } else {
            setError("Something wrong happened");
          }
        } else {
          setError(json.message);
        }
      })
      .catch((err) => setError(err.message));
    setTimeout(() => {
      setIsLoading(false);
      navigate("/me");
    }, 1000);
  };
  return (
    <div className="signup-container">
      {error && <ErrorModal error={error} callback={() => setError("")} />}
      <form onSubmit={update} className={`login-form ${isLoading && "locked"}`}>
        {message && <div className="form-info">{message}</div>}
        {isLoading && (
          <div className="sp">
            <div className="ssp">
              <Spinner dark />
            </div>
          </div>
        )}
        <h1>
          Update your <b>Trecker</b> Profile
        </h1>
        <div className="login-elem">
          <label htmlFor="profileimage">Profile Image:</label>
          <input
            type="url"
            name="profileimage"
            id="profileimage"
            className="input"
            placeholder="Profile Image..."
            value={profileImage}
            onInput={(e) => setProfileImage(e.target.value)}
          />
        </div>
        <div className="login-elem">
          <label htmlFor="firstname">Firstname:</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            className="input"
            placeholder="Firstname..."
            value={firstname}
            onInput={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="login-elem">
          <label htmlFor="lastname">Lastname:</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Lastname..."
            className="input"
            value={lastname}
            onInput={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="login-elem">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email..."
            className="input"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="button">Update</button>
      </form>
    </div>
  );
}

export default ProfileEdit;
