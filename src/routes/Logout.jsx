import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuth from "../../hooks/isAuth";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();
  const [logged, _] = isAuth();
  const logout = () => {
    if (confirm("Are you sure?")) {
      localStorage.removeItem("jwt_token");
      navigate("/");
    }
  };
  useEffect(() => {
    if (!logged) {
      navigate("/");
    }
  }, []);

  return (
    <div className="logout-container">
      {logged && (
        <div className="logout">
          <h1>Logging out :(</h1>
          <button className="button" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Logout;
