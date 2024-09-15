
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import MessageList from "./MessageList";
import TypingArea from "./TypingArea";
import "./ChatWindow.css";

function ChatWindow({ chatId, token, userId }) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  console.log(userId, "user id in chatwindow");

  const messageListRef = useRef(null);

  // Initialize the socket connection only once
  useEffect(() => {
    const newSocket = io("http://localhost:8011");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen for incoming messages (both text and images)
    newSocket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);

      if (newMessage.url) {
        newMessage.isImage = true; // Mark message as image
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle chatId changes and join/leave chat rooms
  useEffect(() => {
    if (chatId && socket) {
      socket.emit("joinChat", chatId);
      fetchMessages(chatId);

    }

    return () => {
      if (chatId && socket) {
        socket.emit("leaveChat", chatId);
      }
    };
  }, [chatId, socket]);

  // Fetch messages for the given chatId
  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:8011/api/chat/getchat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatMessages = response.data.conversion.messages || [];

      const imageResponse = await axios.get(
        `http://localhost:8011/api/image/getImages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatImages = imageResponse.data.Images || [];
console.log(imageResponse.data.Images,"this is the chat images ")
      // Map images to match the message format
      const imageMessages = chatImages.map((image) => ({
        ...image,
        isImage: true,
      }));

      // Combine messages and images into a single array
      const combinedMessages = [...chatMessages, ...imageMessages];
      console.log(
        "Sorted Messages and Images befor sorting:",
        combinedMessages
      );

      // Sort combined array by createdAt timestamp
      combinedMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      console.log("Sorted Messages and Images:", combinedMessages);

      setMessages(combinedMessages);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // // Scroll to the bottom of the message list when messages change
  // useEffect(() => {
  //   if (messageListRef.current) {
  //     messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  //   }
  // }, [messages]);

  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        userId={userId}
        messageListRef={messageListRef}
        token={token}
        setMessages={setMessages}
      />
      <TypingArea
        chatId={chatId}
        socket={socket}
        userId={userId}
        token={token}
        setMessages={setMessages}
      />
    </div>
  );
}

export default ChatWindow;
