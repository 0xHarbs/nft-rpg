import './Navbar.css';
import React from 'react';
import {Link} from "react-router-dom"
import './Button.css'
import logo from './logo.PNG'


function Navbar() {
  return(
    <>
      <div className="navbar">
        <div className="navbar__left">
          <Link to="/" className="navbar__logo">
            <img className="navbar__logoImg" src={logo} alt="#"/>
          </Link>
        </div>

        <div className="navbar__right">
              <Link to="/" className="nav__links">
                <button className="btn__primary">Fight!</button>
              </Link>
        </div>
      </div>
    </>
    )
}

export default Navbar;