import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h5>About Our Cricket League</h5>
          <p>
            Welcome to North colony cricket leuage! We organize thrilling cricket
            matches and tournaments for cricket enthusiasts.
          </p>
        </div>
        <div className="footer-section contact">
          <h5>Contact Us</h5>
          <ul>
            <li><strong>Name:</strong> Mahaveer Ramani</li>
            <li><strong>Phone:</strong> 03492439953</li>
            <li><strong>Email:</strong> ramanimahaveer4@gmail.com</li>
            <li><strong>Location:</strong> mithi tharaparkar opposite of north coloney mithi</li>
          </ul>
        </div>
        <div className="footer-section social">
          <h5>Follow Us</h5>
          <ul>
            <li><a href="https://www.facebook.com/profile.php?id=100068646013228" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/ramanimahaveer/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} north coloney cricket leuage. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

