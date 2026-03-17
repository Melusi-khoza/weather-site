import React from "react";
import InstaLogo from "./insta-logo.png";
import TtLogo from "./tt-logo.jpg";
import ghLogo from "./images.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <hr />
      <div className="social-media">
        <h3>Get to know me on Social Media</h3>

        <div className="social-icons">
          <a
            href="https://www.instagram.com/melusi_the_operator/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="insta-logo" src={InstaLogo} alt="Instagram" />
          </a>
          <a
            href="https://github.com/Melusi-khoza"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="gh-logo" src={ghLogo} alt="Github" />
          </a>
          <a
            href="https://www.tiktok.com/@melusi_the_operator?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="tt-logo" src={TtLogo} alt="TikTok" />
          </a>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} World Weather Site<br />
          All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
