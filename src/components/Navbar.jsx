import { IconLogout } from "@tabler/icons";
import { IconUser } from "@tabler/icons";
import { IconHome } from "@tabler/icons";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  let location = useLocation();
  const [homeActive, setHomeActive] = useState(false);
  const [meActive, setMeActive] = useState(false);
  const [logoutActive, setLogoutActive] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case "/": {
        setHomeActive(true);
        setMeActive(false);
        setLogoutActive(false);
        break;
      }
      case "/me": {
        setHomeActive(false);
        setMeActive(true);
        setLogoutActive(false);
        break;
      }
      case "/logout": {
        setHomeActive(false);
        setMeActive(false);
        setLogoutActive(true);
        break;
      }
      default: {
        setHomeActive(false);
        setMeActive(false);
        setLogoutActive(false);
        break;
      }
    }
    
  }, [location]);
  return (
    <div className="navbar-container">
      <Link className="link-icon" to={"/"}>
        <div className={`navbar-elem ${homeActive ? "activated" : ""}`}>
          <IconHome />
        </div>
      </Link>

      <Link className="link-icon" to={"/me"}>
        <div className={`navbar-elem ${meActive ? "activated" : ""}`}>
          <IconUser />
        </div>
      </Link>
      <Link className="link-icon" to={"/logout"}>
        <div className={`navbar-elem ${logoutActive ? "activated" : ""}`}>
          <IconLogout />
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
