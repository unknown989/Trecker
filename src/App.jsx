import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Logout from "./routes/Logout";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Todo from "./routes/Todo";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import New from "./routes/New";
import Edit from "./routes/Edit";
import Reset from "./routes/Reset";
import ResetPWD from "./routes/ResetPWD";
import ProfileEdit from "./routes/ProfileEdit";
import Notfound from "./components/Notfound";

const NotfoundC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: 40,
      }}
    >
      <Notfound />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todo/:todoId" element={<Todo />} />
          <Route path="/new/" element={<New />} />
          <Route path="/edit/:todoId" element={<Edit />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/resetpassword/:resetToken" element={<ResetPWD />} />
          <Route path="/profile/" element={<ProfileEdit />} />
          <Route path="*" element={<NotfoundC />} />
        </Routes>
      </div>
      <Navbar className="navbar" />
    </Router>
  );
}

export default App;
