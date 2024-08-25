import React from "react";
import "./about.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/shubh_am09/?next=%2F";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/djt3gzewq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1724551903/avatars/xdqoap1esktr8dpgvfdu.png"
              alt="Founder"
            />
            <Typography>Shubham Gorle</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @shubhamGorle. Only with the
              purpose to learn MERN Stack.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">My Work</Typography>
            <a
              href="https://github.com/shubhamgorle"
              target="blank"
            >
              <GitHubIcon className="githubSvgIcon" />
            </a>
            <a href="https://shubhamgorle.github.io/" target="blank">
              <WorkHistoryIcon className="workHistoryIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;