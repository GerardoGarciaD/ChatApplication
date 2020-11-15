import React from "react";
import loginImage from "../../assets/images/login.svg";

const Login = () => {
  return (
    <div id="auth-container">
      <div id="auth-card">
        <div>
          <div id="image-section">
            <img src={loginImage} alt="Login" />
          </div>
          <div id="form-section">
            <h2>Welcomme back</h2>

            <form>
              <div className="input-field">
                <input type="Wmail" />
              </div>
              <div className="input-field">
                <input type="Password" />
              </div>

              <button>Login</button>
            </form>

            <p>Don't have an account? Register</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
