import './SocialBar.css';
import React from 'react';
import {Link} from "react-router-dom"
import './Button.css'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function SocialBar() {
  return(
    <>
      <div className="socialbar">
        <div className="socialbar__container">
          <h2>Follow for announcements</h2>
          <div className="social__icons">
            <Link to="/fight">
              <TwitterIcon className="icons"/>
            </Link>
            <Link to="/fight">
              <FacebookIcon className="icons"/>
            </Link>
            <Link to="/fight"> 
              <InstagramIcon className="icons"/>
            </Link>
          </div>
        </div>
      </div>
    </>
    )
}

export default SocialBar;