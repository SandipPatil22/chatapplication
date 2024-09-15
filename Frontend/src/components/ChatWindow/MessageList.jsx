

import React, { useState, useEffect } from "react";
import axios from "axios";

function MessageList({ messages, userId, messageListRef, token, setMessages }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Scroll to the bottom of the message list when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle image click to open the popup
  const handleImageClick = async (message) => {
    console.log("this is the send images._id", message._id);
    if (message.oneTime) {
      try {
        // Mark the image as viewed
        await axios.post(
          `http://localhost:8011/api/image/markAsViewed/${message._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedImage(message);
      } catch (error) {
        console.error("Error marking image as viewed", error);
      }
    } else {
      setSelectedImage(message);
    }
  };

  // Handle closing the popup and removing the one-time image
  const handleClosePopup = () => {
    if (selectedImage && selectedImage.oneTime) {
      // Remove the image from the messages state
      const updatedMessages = messages.filter(
        (msg) => msg._id !== selectedImage._id
      );
      setMessages(updatedMessages);
    }
    setSelectedImage(null);
  };

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.length === 0 ? (
        <div className="no-messages">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message._id || message.createdAt} // Use a unique key
            className={`message ${
              message.sender === userId ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              {message.isImage ? (
                message.oneTime ? (
                  <div className="one-time-image">
                    <span
                      className="open-message"
                      onClick={() => handleImageClick(message)}
                    >
                      <i className="fa fa-photo" aria-hidden="true">  Photo</i>
                      
                    </span>
                    {selectedImage === message && (
                      <div className="popup">
                        <span
                          className="close"
                          title="Close"
                          onClick={handleClosePopup}
                        >
                          ×
                        </span>
                        <img
                          src={`http://localhost:8011/${message.url}`}
                          alt="Popup"
                         className="OneTimeImg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={`http://localhost:8011/${message.url}`}
                    alt="Sent image"
                   
                  />
                )
              ) : (
                message.text
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageList;
