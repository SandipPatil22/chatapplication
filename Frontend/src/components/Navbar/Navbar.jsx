

import React from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const ChatNavbar = ({ profilePic, name, onBack }) => {
  return (
    <Navbar bg="light" className="chat-navbar justify-content-between">
      <div className="d-flex align-items-center">
        {/* Back arrow visible on screens 768px and below */}
        <div className="back-arrow m-2" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </div>
        <Navbar.Brand className="d-flex align-items-center">
          <Image
            src={`http://localhost:8011/${profilePic}`}
            roundedCircle
            className="profile-pic"
          />
          <span className="profile-name">{name}</span>
        </Navbar.Brand>
      </div>
      {/* <Nav className="ml-auto d-flex align-items-center">
        <Nav.Link href="#">
          <FontAwesomeIcon icon={faPhone} size="lg" />
        </Nav.Link>
        <Nav.Link href="#">
          <FontAwesomeIcon icon={faVideo} size="lg" />
        </Nav.Link>
      </Nav> */}
    </Navbar>
  );
};

export default ChatNavbar;
