import React, { useState, useEffect, useRef, useContext } from 'react';
import { useChat } from '../contexts/ChatContext';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { toast } from 'react-toastify';
import { IoMdClose, IoMdSend } from 'react-icons/io';
import { FaUsers, FaComments, FaCircle } from 'react-icons/fa';
import '../assets/css/chat.css';

export function ChatInterface() {
  const {
    isConnected,
    hasJoined,
    messages,
    onlineUsers,
    loading,
    error,
    joinChat,
    leaveChat,
    sendMessage,
    loadMessages,
    loadOnlineUsers,
    updateOnlineStatus
  } = useChat();

  const { user } = useContext(AuthContext);
  const { content } = useContext(LanguageContext);
  
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when user is authenticated
  useEffect(() => {
    if (user && isConnected && !hasJoined) {
      initializeChat();
    }
  }, [user, isConnected]);

  // Listen for chat toggle event from NavBar
  useEffect(() => {
    const handleToggleChat = () => {
      setShowChat(!showChat);
      if (!showChat && user && !hasJoined) {
        initializeChat();
      }
    };

    window.addEventListener('toggleChat', handleToggleChat);
    return () => window.removeEventListener('toggleChat', handleToggleChat);
  }, [showChat, user, hasJoined]);

  // Update online status periodically
  useEffect(() => {
    if (hasJoined) {
      const interval = setInterval(() => {
        updateOnlineStatus();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [hasJoined]);

  const initializeChat = async () => {
    try {
      await joinChat();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      toast.error('Failed to connect to chat');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isTyping) return;

    setIsTyping(true);
    
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat && user && !hasJoined) {
      initializeChat();
    }
  };

  const handleLeaveChat = async () => {
    try {
      await leaveChat();
      setShowChat(false);
      toast.success('Left chat room');
    } catch (error) {
      console.error('Failed to leave chat:', error);
    }
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-20 right-4 z-50 bg-[#12486b] hover:bg-[#0d3a5a] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Global Chat"
      >
        <FaComments className="w-6 h-6" />
        {isConnected && (
          <FaCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-400" />
        )}
      </button>

      {/* Chat Interface */}
      {showChat && (
        <div className="fixed bottom-24 right-4 z-50 w-80 h-96 bg-[#181c2f] rounded-lg shadow-2xl border border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 bg-[#12486b] rounded-t-lg">
            <div className="flex items-center gap-2">
              <FaComments className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Global Chat</span>
              {isConnected && (
                <FaCircle className="w-2 h-2 text-green-400" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="text-white hover:text-yellow-400 transition-colors"
                title="Online Users"
              >
                <FaUsers className="w-4 h-4" />
                <span className="text-xs ml-1">{onlineUsers.length}</span>
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-red-400 transition-colors"
                title="Close Chat"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex">
            {/* Messages Area */}
            <div className={`flex-1 flex flex-col ${showOnlineUsers ? 'w-2/3' : 'w-full'}`}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-400 text-center text-sm p-2">
                    {error}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-gray-400 text-center text-sm p-4">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.user_id === user.id
                            ? 'bg-[#12486b] text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-yellow-400">
                            {message.user_name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm break-words">{message.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={isTyping || !hasJoined}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !hasJoined || !newMessage.trim()}
                    className="px-3 py-2 bg-[#12486b] text-white rounded-lg hover:bg-[#0d3a5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isTyping ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <IoMdSend className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Online Users Sidebar */}
            {showOnlineUsers && (
              <div className="w-1/3 border-l border-gray-700 bg-gray-800">
                <div className="p-2 bg-gray-700">
                  <h3 className="text-white text-sm font-semibold">Online Users</h3>
                </div>
                <div className="overflow-y-auto h-full">
                  {onlineUsers.map((onlineUser) => (
                    <div
                      key={onlineUser.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-700 transition-colors"
                    >
                      <FaCircle className="w-2 h-2 text-green-400" />
                      <span className="text-white text-sm truncate">
                        {onlineUser.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
