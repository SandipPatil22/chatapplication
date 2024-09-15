import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { ListGroup, Image, Badge } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveAllUserData } from "../../store/getallUserSlice";
import UserProfilePopup from "../userProfilePopup/UserProfilePopup";

const Sidebar = ({ onSelectChat }) => {
  const [contacts, setContacts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8011/api/user/getUser"
        );
        const allUsers = response.data.data;

        // Assuming the API returns all users including the logged-in user, you need to identify the logged-in user
        const token = localStorage.getItem("auth");
        const loggedInUserData = token && JSON.parse(token);

        if (loggedInUserData) {
          // Find the logged-in user in the fetched data
          const loggedInUser = allUsers.find(
            (user) => user._id === loggedInUserData._id
          );
          setLoggedInUser(loggedInUser);

          // Filter out the logged-in user from the contacts list
          const filteredContacts = allUsers.filter(
            (contact) => contact._id !== loggedInUserData._id
          );
          setContacts(filteredContacts);
          dispatch(saveAllUserData(filteredContacts));
          console.log(filteredContacts, "filtered contacts data ");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getContacts();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <div className="sidebar">
      {loggedInUser && (
        <div
          className="sidebar-profile "
          onClick={() => setShowProfilePopup(true)}
        >
          <h4 className="sidebar-title">Chats</h4>
          <Image
            src={`http://localhost:8011/${loggedInUser.profilePic}`}
            roundedCircle
            className="sidebar-profile-pic"
            alt={`${loggedInUser.fullName}'s profile`}
          />
        </div>
      )}

      <ListGroup variant="flush">
        {contacts.map((contact, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => onSelectChat(contact)}
            className="sidebar-item"
          >
            <Image
              src={`http://localhost:8011/${contact.profilePic}`}
              roundedCircle
              className="sidebar-profile-pic"
              alt={`${contact.userName}'s profile`}
            />
            {contact.fullName}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* Render the UserProfilePopup component */}
      {loggedInUser && (
        <UserProfilePopup
          show={showProfilePopup}
          onHide={() => setShowProfilePopup(false)}
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Sidebar;
