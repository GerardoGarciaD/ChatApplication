import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../../../store/actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [showProfileOptions, setShowProfileOptions] = useState(false);
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
          <FontAwesomeIcon
            icon="caret-down"
            className="fa-icon"
          ></FontAwesomeIcon>
          {/* Toggle para mostrar u ocultar opciones del usuario  */}
          {showProfileOptions && (
            <div id="profile-options">
              <p>Update profile</p>
              <p onClick={() => dispatch(logout())}>Logout</p>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
