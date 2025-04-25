import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon } from '@mui/icons-material';

const ChatContainer = styled(Box)(({ theme }) => ({
  width: '280px',
  height: '100vh',
  backgroundColor: '#F8F9FA',
  borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#F8F9FA',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const MessageBubble = styled(Paper)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : '#fff',
  color: isUser ? '#fff' : theme.palette.text.primary,
  borderRadius: '12px',
  boxShadow: 'none',
  border: isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
  '& .message-text': {
    fontSize: '13px',
    lineHeight: 1.4,
  },
  '& .message-time': {
    fontSize: '11px',
    color: isUser ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#fff',
}));

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: "I'll help you with that. What specific information do you need?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32,
            backgroundColor: '#1a73e8',
            fontSize: '14px'
          }}
        >
          A
        </Avatar>
        <Typography sx={{ fontWeight: 500, fontSize: '15px' }}>
          Assistant
        </Typography>
      </ChatHeader>

      <ChatMessages>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            <div className="message-text">{message.text}</div>
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </MessageBubble>
        ))}
      </ChatMessages>

      <ChatInput>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={4}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F8F9FA',
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.12)'
              },
              '&.Mui-focused fieldset': {
                borderColor: (theme) => theme.palette.primary.main
              }
            },
            '& .MuiInputBase-input': {
              fontSize: '13px',
              padding: '12px',
              paddingRight: '40px'
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  bottom: 8,
                  color: newMessage.trim() ? '#1a73e8' : 'rgba(0, 0, 0, 0.26)'
                }}
              >
                <SendIcon />
              </IconButton>
            )
          }}
        />
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatPanel; 