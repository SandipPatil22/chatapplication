import React from "react";
import Login from "../components/Login/Login";

const LoginPage = ({ onLoginSuccess }) => {
  return <Login onLoginSuccess={onLoginSuccess} />;
};

export default LoginPage;
