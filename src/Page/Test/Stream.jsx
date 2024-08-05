import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import conversationApi from '../../api/conversation.api';

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

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      const response = await conversationApi.createChat({
        prompt: input,
        conversationID: "c91b32b7-e69a-44d9-8d8c-42f771a959ea"
      }, 
      true);
      setInput('');

      console.log("body", response.body)

      const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader()
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
            break
        }

        console.log("value", value)

      }
    }
  };



  useEffect(() => {
    const eventSource = new EventSource('/api/streamMessages');
    
    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      scrollToBottom();
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  return (
    <AppContainer>
      <ChatWindow ref={chatWindowRef}>
        {messages.map((message, index) => (
          <Message key={index}>{message}</Message>
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

export default App;
