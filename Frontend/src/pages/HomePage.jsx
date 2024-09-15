import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatNavbar from "../components/Navbar/Navbar";
import ChatWindow from "../components/ChatWindow/Chatwindow";
import "../App.css";
import axios from "axios";

const HomePage = ({ socket, user }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatIds, setChatIds] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelectChat = async (contact) => {
    if (chatIds[contact._id]) {
      setActiveChat(contact);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8011/api/chat/createChat",
          {
            userId: contact._id,
            loginUserId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const chatId = response.data.chat._id;
        setChatIds((prev) => ({ ...prev, [contact._id]: chatId }));
        setActiveChat(contact);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const existingChatId = error.response.data.chat._id;
          setChatIds((prev) => ({ ...prev, [contact._id]: existingChatId }));
          setActiveChat(contact);
        } else {
          console.error("Error creating chat:", error);
        }
      }
    }
    setIsChatOpen(true);
  };
  const handleBackToSidebar = () => {
    setIsChatOpen(false); // Go back to sidebar when the back arrow is clicked
  };
  return (
    <div className={`app ${isChatOpen ? "chat-open" : ""}`}>
      <Sidebar
        onSelectChat={handleSelectChat}
        className={`sidebar ${isChatOpen ? "hide-sidebar" : ""}`}
      />
      <div className={`chat-area ${isChatOpen ? "chat-open" : ""}`}>
        {activeChat ? (
          <>
            <ChatNavbar
              profilePic={activeChat.profilePic}
              name={activeChat.fullName}
              onBack={handleBackToSidebar} // Pass the back handler to ChatNavbar
            />
            <ChatWindow
              chatId={chatIds[activeChat._id]}
              socket={socket}
              token={user.token}
              userId={user._id}
            />
          </>
        ) : (
          <div className="chat-window">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};
export default HomePage;

