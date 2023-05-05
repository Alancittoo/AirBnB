import React from "react";
import { NavLink, Link, } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="navigation-bar">
      <li className="home-button">
        <div className='logo-container'>
          <NavLink exact to="/" className='navlink-home'><img alt="" src="https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png" height='50'/><p className='logo-text' >airbnb</p></NavLink>

          </div>
      </li>
      {isLoaded &&
        <div className='loggedin-container'>
          <div>
            {!sessionUser ? null :
            <div className='create-spot-link-container'>
              <Link to="/spots/new" className='navbar-create-spot' > <p className='navbar-create-spot'>Create a New Spot</p></Link>
            </div>}
          </div>
          <div>
            <li className="profile-button">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        </div>}
    </ul>
  );
}

export default Navigation;
