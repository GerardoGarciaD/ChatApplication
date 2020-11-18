import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Modal/Modal";
import "./Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../../../store/actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(user.gender);
  const [avatar, setAvatar] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    const form = { firstName, lastName, email, gender, password, avatar };

    const formData = new FormData();

    for (const key in form) {
      formData.append(key, form[key]);
    }

    //Dispatch
  };
  return (
    <div
      onClick={() => setShowProfileOptions(!showProfileOptions)}
      id="navbar"
      className="card-shadow"
    >
      <h2>Chat.io</h2>
      <div id="profile-menu">
        <img width="40" height="40" src={user.avatar} alt="Avatar" />
        <p>
          {user.firstName} {user.lastName}
        </p>
        <FontAwesomeIcon
          icon="caret-down"
          className="fa-icon"
        ></FontAwesomeIcon>
        {/* Toggle para mostrar u ocultar opciones del usuario  */}
        {showProfileOptions && (
          <div id="profile-options">
            <p onClick={() => setShowProfileModal(true)}>Update profile</p>
            <p onClick={() => dispatch(logout())}>Logout</p>
          </div>
        )}
        {showProfileModal && (
          // Aqui se manda esta funcion como prop para que pueda ser ejecutada desde el componente Modal
          <Modal click={() => setShowProfileModal(false)}>
            <Fragment key="header">
              <h3 className="m-0">Update profile</h3>
            </Fragment>

            <Fragment key="body">
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
                <div className="input-field mb-2">
                  <input
                    onChange={(e) => setAvatar(e.target.files[0])}
                    type="file"
                  />
                </div>
              </form>
            </Fragment>

            <Fragment key="footer">
              <button className="btn-success">UPDATE</button>
            </Fragment>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Navbar;
