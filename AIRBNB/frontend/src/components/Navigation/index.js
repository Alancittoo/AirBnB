import React from "react";
import { NavLink, Link, } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useState } from "react";
import { thunkGetAllSpots, thunkSearchSpots } from "../../store/spotsReducer";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(thunkSearchSpots(searchTerm));
    }
  };

  return (
    <ul className="navigation-bar">
      <li className="home-button">
        <div className='logo-container' onClick={() => dispatch(thunkGetAllSpots())}>
          <NavLink exact to="/" className='navlink-home'><img alt="" src="https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png" height='50'/><p className='logo-text' >airbnb</p></NavLink>

          </div>
      </li>

      {isLoaded &&
        <div className='loggedin-container'>
<div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Search"
            />
          </div>
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
