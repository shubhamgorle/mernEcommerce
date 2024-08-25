import React from 'react'
import Appstore from "../../images/Appstore.png"
import playstore from "../../images/playstore.png"
import "./footer.css"
const Footer = () => {
  return (
    <footer id='footer'>
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playstore} alt="playstore" />
            <img src={Appstore} alt="Appstore" />
        </div>

        <div className="midFooter">
            <h1>ECOMMERCE</h1>
            <p>High Quality is our first priority</p>
            <p>Copyrights 2023 &copy: MrShubhamGorle</p>
        </div>

        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/shubh_am09/?next=%2F">Instagram</a>
            <a href="https://github.com/shubhamgorle">Github</a>
            <a href="https://www.linkedin.com/in/shubham-gorle/">Linkedin</a>
        </div>
     </footer>
  )
}

export default Footer
