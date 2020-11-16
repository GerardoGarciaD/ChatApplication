import React, { useState } from "react";
import registerImage from "../../assets/images/register.svg";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../../store/actions/auth";

const Register = ({ history }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");

  const submitForm = (e) => {
    e.preventDefault();
    // AuthService.login({ email, password }).then((res) => console.log(res));
    dispatch(
      register({ firstName, lastName, gender, email, password }, history)
    );
  };

  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={registerImage} alt="Register" />
          </div>
          <div id="form-section">
            <h2>Create an account</h2>

            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required="required"
                  placeholder="First Name"
                />
              </div>
              <div className="input-field mb-1">
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required="required"
                  placeholder="Last Name"
                />
              </div>

              <div className="input-field mb-1">
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  required="required"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

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
