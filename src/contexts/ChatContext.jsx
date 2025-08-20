// Production ChatProvider - FIXED for Laravel Reverb
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import chatConfig, { validateMessage } from '../config/chat.js';

// Production Echo Configuration for Laravel Reverb
const initializeEcho = (token) => {
    window.Pusher = Pusher;
    
    const echoConfig = {
        broadcaster: 'reverb', // Use 'reverb' for Laravel Reverb
        key: chatConfig.pusher.key,
        host: chatConfig.pusher.host, // delightmyanmar99.pro
        port: chatConfig.pusher.port, // 443
        scheme: chatConfig.pusher.scheme, // https
        forceTLS: chatConfig.pusher.forceTLS,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        },
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        enableLogging: false, // Disable in production
    };
    
    // Debug: Log the exact configuration being passed to Echo
    console.log('🔍 Echo Configuration Debug:');
    console.log('Full Echo config:', echoConfig);
    console.log('Broadcaster:', echoConfig.broadcaster);
    console.log('Host:', echoConfig.host);
    console.log('Port:', echoConfig.port);
    console.log('Scheme:', echoConfig.scheme);
    
    return new Echo(echoConfig);
};

// Chat Context
const ChatContext = createContext();

// Chat Reducer
const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'SET_ONLINE_USERS':
            return { ...state, onlineUsers: action.payload };
        case 'SET_CONNECTION_STATUS':
            return { ...state, isConnected: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_JOINED':
            return { ...state, hasJoined: action.payload };
        default:
            return state;
    }
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, {
        messages: [],
        onlineUsers: [],
        isConnected: false,
        loading: false,
        error: null,
        hasJoined: false,
    });

    const [echo, setEcho] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Get API base URL from environment or use default
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'https://delightmyanmar99.pro/api';
    
    // Debug: Log all environment variables
    console.log('🔍 Environment Variables Debug:');
    console.log('All env vars:', import.meta.env);
    console.log('VITE_REVERB_APP_KEY:', import.meta.env?.VITE_REVERB_APP_KEY);
    console.log('VITE_REVERB_HOST:', import.meta.env?.VITE_REVERB_HOST);
    console.log('VITE_REVERB_PORT:', import.meta.env?.VITE_REVERB_PORT);
    console.log('VITE_REVERB_SCHEME:', import.meta.env?.VITE_REVERB_SCHEME);
    console.log('API Base URL:', apiBaseUrl);

    // Listen for token changes
    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('token');
            setToken(newToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Initialize Echo connection
    useEffect(() => {
        if (token && !echo) {
            try {
                const echoInstance = initializeEcho(token);
                setEcho(echoInstance);
                
                // Listen for connection events
                echoInstance.connector.socket.on('connect', () => {
                    console.log('WebSocket connected successfully');
                    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
                });

                echoInstance.connector.socket.on('disconnect', () => {
                    console.log('WebSocket disconnected');
                    dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
                });

                echoInstance.connector.socket.on('connect_error', (error) => {
                    console.error('WebSocket connection error:', error);
                    dispatch({ type: 'SET_ERROR', payload: 'Connection failed' });
                });

            } catch (error) {
                console.error('Failed to initialize Echo:', error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize connection' });
            }
        }

        return () => {
            if (echo) {
                echo.disconnect();
            }
        };
    }, [token]);

    // Join global chat
    const joinChat = async () => {
        if (!token) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const url = `${apiBaseUrl}${chatConfig.endpoints.join}`;
            console.log('Attempting to join chat at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'SET_JOINED', payload: true });
                
                // Listen for messages
                if (echo) {
                    echo.private(`chat.${data.room_id}`)
                        .listen('ChatMessageSent', (e) => {
                            dispatch({ type: 'ADD_MESSAGE', payload: e.message });
                        })
                        .listen('UserJoinedChat', (e) => {
                            console.log('User joined:', e.user);
                        })
                        .listen('UserLeftChat', (e) => {
                            console.log('User left:', e.user);
                        });
                }
                
                // Load initial messages
                await loadMessages();
                await loadOnlineUsers();
                
            } else {
                throw new Error('Failed to join chat');
            }
        } catch (error) {
            console.error('Join chat error:', error);
            dispatch({ type: 'SET_ERROR', payload: chatConfig.messages.joinError });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Leave chat
    const leaveChat = async () => {
        if (!token) return;

        try {
            await fetch(`${apiBaseUrl}${chatConfig.endpoints.leave}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            dispatch({ type: 'SET_JOINED', payload: false });
            
            if (echo) {
                echo.leave(`chat.1`); // Leave the channel
            }
        } catch (error) {
            console.error('Leave chat error:', error);
        }
    };

    // Send message
    const sendMessage = async (message) => {
        if (!token || !state.hasJoined) return;

        const validation = validateMessage(message);
        if (!validation.valid) {
            dispatch({ type: 'SET_ERROR', payload: validation.error });
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}${chatConfig.endpoints.sendMessage}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Message will be added via WebSocket event
        } catch (error) {
            console.error('Send message error:', error);
            dispatch({ type: 'SET_ERROR', payload: chatConfig.messages.messageError });
        }
    };

    // Load messages
    const loadMessages = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${apiBaseUrl}${chatConfig.endpoints.messages}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'SET_MESSAGES', payload: data.messages || [] });
            }
        } catch (error) {
            console.error('Load messages error:', error);
        }
    };

    // Load online users
    const loadOnlineUsers = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${apiBaseUrl}${chatConfig.endpoints.onlineUsers}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'SET_ONLINE_USERS', payload: data.users || [] });
            }
        } catch (error) {
            console.error('Load online users error:', error);
        }
    };

    // Update online status
    const updateOnlineStatus = async () => {
        if (!token) return;

        try {
            await fetch(`${apiBaseUrl}${chatConfig.endpoints.updateStatus}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const value = {
        ...state,
        joinChat,
        leaveChat,
        sendMessage,
        loadMessages,
        loadOnlineUsers,
        updateOnlineStatus,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use chat context
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export default ChatProvider;
