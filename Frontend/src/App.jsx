

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUp from './components/Signup/Signup'
import { io } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("auth");
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      // Assume token is a string, so don't parse it
      setIsLoggedIn(true);
      setUser(JSON.parse(token)); // You can set the token directly
    }
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8011");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from server");
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(userData)); // Store user data as JSON
  };

  return (
    // <Router>
    //   <Routes>
    //     <Route
    //       path="/"
    //       element={
    //         isLoggedIn ? (
    //           <Navigate to="/home" />
    //         ) : (
    //           <LoginPage onLoginSuccess={handleLoginSuccess} />
    //         )
    //       }
    //     />
    //     <Route
    //       path="/home"
    //       element={
    //         isLoggedIn ? (
    //           <HomePage socket={socket} user={user} />
    //         ) : (
    //           <Navigate to="/" />
    //         )
    //       }
    //     />
    //     <Route
    //       path="/login"
    //       element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
    //     />
    //   </Routes>
    // </Router>

    <Router>
      <Routes>
        {/* Render LoginPage when the user navigates to the root path ("/") */}
        <Route
          path="/"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Render LoginPage when the user navigates to the "/login" path */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        {/* Render SignUpPage when the user navigates to the "/signup" path */}
        <Route path="/signup" element={<SignUp />} />

        {/* Render HomePage only if the user is logged in, otherwise redirect to "/login" */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <HomePage socket={socket} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
