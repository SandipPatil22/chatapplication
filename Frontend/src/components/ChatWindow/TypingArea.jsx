
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPaperPlane, faTimes, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function TypingArea({ chatId, socket, userId, token, setMessages }) {
  const [messageInput, setMessageInput] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isOneTime, setIsOneTime] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the camera to capture an image
  const handleCaptureImage = async () => {
    setCapturedImage(null);
    setSelectedFile(null); // Clear any previously selected file
    setIsPopupVisible(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  // Take a snapshot from the video stream
  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/png");
    setCapturedImage(imageDataURL);

    // Stop the camera stream
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  // Handle file selection from the device
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCapturedImage(null); // Clear any previously captured image
      setSelectedFile(file);
      setIsPopupVisible(true);
    }
  };

  // Send the captured image or selected file
  const handleSendCapturedImage = async () => {
    const formData = new FormData();
    if (capturedImage) {
      const blob = await (await fetch(capturedImage)).blob();
      formData.append("url", blob,"captured-image.png");
    } else if (selectedFile) {
      formData.append("url", selectedFile);
    } else {
      return; // No image or file to send
    }

    formData.append("chatId", chatId);
    formData.append("sender", userId);
    formData.append("oneTime", isOneTime);

    try {
      const response = await axios.post(
        `http://localhost:8011/api/image/sendImage/${chatId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newImageMessage = {
        chatId,
        sender: userId,
        _id: response.data.image._id,
        url: response.data.image.url,
        createdAt: response.data.image.createdAt || new Date().toISOString(),
        isImage: true,
        oneTime: isOneTime,
        viewed: false,
      };

      socket.emit("sendMessage", newImageMessage);
      setCapturedImage(null);
      setSelectedFile(null);
      setIsPopupVisible(false); // Hide the popup after sending
    } catch (error) {
      console.error("Error sending image or file:", error);
    }
  };

  // Send a normal text message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      chatId,
      sender: userId,
      text: messageInput,
      createdAt: new Date().toISOString(),
      isImage: false,
    };

    try {
            socket.emit("sendMessage", newMessage);
      
            await axios.post(
              "http://localhost:8011/api/message/message",
              newMessage,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      
            setMessageInput("");
          } catch (error) {
            console.error("Error sending message:", error);
          }
  };

  // Handle the Enter key press for sending messages
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Close the popup and reset the state
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setCapturedImage(null);
    setSelectedFile(null);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop the camera stream
    }
  };

  return (
    <div className="typing-area">
      <input
        type="text"
        placeholder="Type a message"
        className="message-input"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={handleKeyPress} // Send message on Enter key press
      />
      <button className="icon-button" onClick={handleSendMessage}>
        <FontAwesomeIcon icon={faPaperPlane} className="icon" />
      </button>
      <button className="icon-button" onClick={handleCaptureImage}>
        <FontAwesomeIcon icon={faCamera} className="icon" />
      </button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        id="file-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="icon-button">
        <FontAwesomeIcon icon={faFileUpload} className="icon" />
      </label>

      {/* Popup for captured image or selected file */}
      {isPopupVisible && (
        <div className="fullscreen-overlay">
          {capturedImage || selectedFile ? (
            <div className="capture-container">
              <img
                src={capturedImage || URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="fullscreen-image"
              />
              <div className="options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={() => setIsOneTime(!isOneTime)}
                  />
                  <span className="checkmark"></span>
                  Send as One-Time Image
                </label>
                <button onClick={handleSendCapturedImage} className="icon-button send-button">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          ) : (
            <div className="capture-container">
              <video ref={videoRef} autoPlay className="video-stream" />
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <button onClick={handleTakeSnapshot} className="icon-button capture-icon">
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
          )}
          <button className="icon-button close-button" onClick={handleClosePopup}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TypingArea;
