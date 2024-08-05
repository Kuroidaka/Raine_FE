import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import conversationApi from '../../api/conversation.api';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../config';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ChatWindow = styled.div`
  width: 80%;
  max-width: 600px;
  height: 70vh;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 20px;
`;

const Message = styled.div`
  background-color: #e1ffc7;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 80%;
  max-width: 600px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;


function StreamTest() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      setInput('');
      setMessages([...messages, {text: input, role: "user"}])
      await conversationApi.createChat({
        prompt: input,
        conversationID: "c91b32b7-e69a-44d9-8d8c-42f771a959ea"
      }, 
      true);


    }
  };

  // useEffect(() => {
  //   const socket = io('http://192.168.1.7:8001', {
  //     transports: ['websocket', 'polling'],
  //   });

  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from server');
  //   });

  //   // Clean up the connection on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);


  useEffect(() => {
    const socket = io('http://192.168.1.7:8001', {
      transports: ['websocket', 'polling'],
    });

    socket.on('chatResChunk', ({ content }) => {
      console.log(content);
      setMessages(prev => {
        if (prev[prev.length - 1]?.role === 'user') {
          return [...prev, { role: 'assistant', text: content }];
      }
      return [...prev.slice(0, -1), { role: 'assistant', text: content }];
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <AppContainer>
      <ChatWindow ref={chatWindowRef}>
        {messages.map((message, index) => (
          <Message key={index}>{message.text}</Message>
        ))}
      </ChatWindow>
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </InputContainer>
    </AppContainer>
  );
}

export default StreamTest;
