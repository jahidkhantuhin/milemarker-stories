import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import { TravelContext } from "../../context/travel-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const travel = useContext(TravelContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          Explore
        </NavLink>
      </li>
      <li><NavLink to="/community">Community</NavLink></li>
      <li><NavLink to="/saved">Saved <span className="nav-count">{travel.savedIds.length}</span></NavLink></li>
      <li><NavLink to="/trip-planner">Trip board <span className="nav-count">{travel.tripIds.length}</span></NavLink></li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
