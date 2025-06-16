"use client"

import { useState, useRef, useEffect } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import "./Llm.css"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Nlp() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "How can I help you today?", isUser: false, isHTML: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [useSpeechInput, setUseSpeechInput] = useState(false);

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (message, isUser = false, isHTML = false) => {
    setMessages(prev => [...prev, { text: message, isUser, isHTML }]);
  };

  const sendMessage = async (messageText) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageText }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Build the base domain and tool link
      const baseDomain = "http://localhost:3000/dashboard/";
      const toolLink = baseDomain + data.path;
      // Create an HTML anchor tag to replace the URL with the word "LINK"
      const toolLinkHtml = `<a href="${toolLink}" target="_blank" rel="noopener noreferrer">LINK</a>`;
      
      // Build the output with HTML markup and line breaks (<br> tags)
      const botText = data.description ? 
        `Based on your query, I recommend using the <strong>${data.name}</strong> tool.<br><br>
        📄 Description: ${data.description}<br><br>
        🔗 Open here: ${toolLinkHtml}` :
        "Sorry, I couldn't process that request.";
      
      // Mark this message as containing HTML
      addMessage(botText, false, true);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(`Error: ${error.message || "Failed to get response from server"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        addMessage(inputMessage, true);
        sendMessage(inputMessage);
        setInputMessage("");
      }
    }
  };

  const speakText = (text, messageIndex) => {
    window.speechSynthesis.cancel();
    if (speakingMessageId === messageIndex) {
      setSpeakingMessageId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    setSpeakingMessageId(messageIndex);
    utterance.onend = () => setSpeakingMessageId(null);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeechInput = () => {
    if (!useSpeechInput) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
    setUseSpeechInput(!useSpeechInput);
    resetTranscript();
  };

  return (
    <div ref={widgetRef} className={`chat-widget ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button onClick={toggleWidget} className="widget-button" aria-label="Open chat widget">
          Chat
        </button>
      ) : (
        <>
          <div className="widget-header">
            <h3>Innovatrix</h3>
            <div className="header-buttons">
              <button onClick={toggleSpeechInput} className={`icon-button ${useSpeechInput ? "active" : ""}`}>
                🎤
              </button>
              <button onClick={toggleWidget} className="icon-button" aria-label="Minimize chat widget">
                —
              </button>
              <button onClick={() => setIsOpen(false)} className="icon-button" aria-label="Close chat widget">
                ✖
              </button>
            </div>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isUser ? "user-message" : "bot-message"}`}>
                <div className="message-content">
                  {message.isHTML ? (
                    <p dangerouslySetInnerHTML={{ __html: message.text }} style={{ wordWrap: "break-word" }} />
                  ) : (
                    <p style={{ wordWrap: "break-word" }}>{message.text}</p>
                  )}
                  {!message.isUser && (
                    <button onClick={() => speakText(message.text, index)} className={`speak-button ${speakingMessageId === index ? "speaking" : ""}`}>
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            {useSpeechInput ? (
              <div className="speech-input">
                <div className={`transcript ${listening ? "listening" : ""}`}>{transcript || "Speak now..."}</div>
                <div className="speech-controls">
                  <div className="control-buttons">
                    {listening ? (
                      <button onClick={SpeechRecognition.stopListening} className="control-button stop">Stop</button>
                    ) : (
                      <button onClick={() => SpeechRecognition.startListening({ continuous: true })} className="control-button start">Start</button>
                    )}
                    <button onClick={resetTranscript} className="control-button reset">Reset</button>
                  </div>
                  <button onClick={() => sendMessage(transcript)} disabled={!transcript.trim() || isLoading} className={`send-button ${!transcript.trim() || isLoading ? "disabled" : ""}`}>Send</button>
                </div>
              </div>
            ) : (
              <div className="text-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  onClick={() => {
                    addMessage(inputMessage, true);
                    sendMessage(inputMessage);
                    setInputMessage("");
                  }}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`send-button ${!inputMessage.trim() || isLoading ? "disabled" : ""}`}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}