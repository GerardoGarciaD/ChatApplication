import React from "react";
import registerImage from "../../assets/images/register.svg";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={registerImage} alt="Register" />
          </div>
          <div id="form-section">
            <h2>Create an account</h2>

            <form>
              <div className="input-field mb-1">
                <input type="text" placeholder="First Name" />
              </div>
              <div className="input-field mb-1">
                <input type="text" placeholder="Last Name" />
              </div>

              <div className="input-field mb-1">
                <select name="" id="">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="input-field mb-1">
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field mb-2">
                <input type="password" placeholder="Password" />
              </div>

              <button>Register</button>
            </form>

            <p>
              Already have an account? <Link to="/login"> Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
