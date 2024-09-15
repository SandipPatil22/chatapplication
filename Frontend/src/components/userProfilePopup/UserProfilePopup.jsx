import React from "react";
import { Modal, Button, Image } from "react-bootstrap";
import "./UserProfilePopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const UserProfilePopup = ({ show, onHide, user, onLogout }) => {
  console.log(user,'user data fri show i user profile')
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Image
          src={`http://localhost:8011/${user.profilePic}`}
          roundedCircle
          alt={`${user.fullName}'s profile`}
          className="profileImage mb-4"
        />
        <h5>
          {user.fullName}
          {/* <FontAwesomeIcon icon={faPencilAlt} style={{ marginLeft: "8px" }} /> */}
        </h5>
        <p>{user.email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onLogout}>
          Logout
        </Button>
        {/* <Button variant="secondary" onClick={onHide}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfilePopup;

