import { IconChevronLeft } from "@tabler/icons";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from "../../public/logo.svg";

import "./Header.css";

const useLocationChange = (action) => {
  const location = useLocation();
  useEffect(() => {
    action(location);
  }, [location]);
};
function Header() {
  const [goBack, setGoBack] = useState(false);
  useLocationChange((location) => {
    if (
      location.pathname.includes("/todo") ||
      location.pathname.includes("/new") ||
      location.pathname.includes("/edit") ||
      location.pathname.includes("/login") ||
      location.pathname.includes("/signup") ||
      location.pathname.includes("/profile")
    ) {
      setGoBack(true);
    } else {
      setGoBack(false);
    }
  });

  return (
    <div className="header-container">
      {goBack && (
        <Link to="/" className="back link">
          <IconChevronLeft />
        </Link>
      )}
      <img src={Logo} className="logo" />
      <h1>Trecker</h1>
    </div>
  );
}

export default Header;
