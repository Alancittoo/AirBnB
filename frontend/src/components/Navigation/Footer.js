import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-details">
        <br/>
        <br/>
            <p>About Me: Github
                <a href='https://github.com/Alancittoo' target='_blank'>
				<button className="footer" style={{border:'none'}}><i style={{marginRight:'1px', marginBottom:'3px', scale:'1.9', marginLeft:'1px'}} class="fa-brands fa-github"></i></button>
				</a>
                LinkedIn
                <a href='https://www.linkedin.com/in/alan-echenique/' target='_blank'>
				<button className="footer" style={{border:'none'}}><i style={{marginRight:'10px', marginBottom:'3px', scale:'1.9', marginLeft:'1px'}} class="fa-brands fa-linkedin"></i></button>
				</a>
                </p>
        </footer>
    );
};

export default Footer;
