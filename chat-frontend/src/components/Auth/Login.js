import React, { useState } from "react";
import loginImage from "../../assets/images/login.svg";
import "./Auth.scss";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    AuthService.login({ email, password }).then((res) => console.log(res));
  };
  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={loginImage} alt="Login" />
          </div>
          <div id="form-section">
            <h2>Welcome back</h2>

            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required="required"
                  value={email}
                  placeholder="Email"
                />
              </div>
              <div className="input-field mb-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required="required"
                  value={password}
                  placeholder="Password"
                />
              </div>

              <button>Login</button>
            </form>

            <p>
              Don't have an account? <Link to="/register"> Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
