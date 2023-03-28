import { useEffect, useRef, useState } from 'react';
import Message from './MessageItem';
import { Auth, API } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";


const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    onSetProcessing(true);
    
    // (async () => {
    //     const getMessages = await API.get("api", `/messages/${chat.id}`);
    //     setMessages(getMessages.message);
    //     onSetProcessing(false);
    // })();

    API.get("api", `/messages/${chat.id}`)
        .then(res => setMessages(res.message))
        .then(onSetProcessing(false));

  }, [chat]);

  

  const handleSend = async () => {
    if (!input || input.trim() === "") {
        inputRef.current.focus();
        return;
    }
    
    if (!user) {
        alert("Login first, please");
        return;
    }


    onSetProcessing(true);

    const addingMessage = await API.post(
        "api",
        "/newMessage",
        {
            body: { 
                chatId: chat.id,
                content: input
             },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                  .getAccessToken()
                  .getJwtToken()}`,
              },
        }
    );

    if (addingMessage.error) {
        alert("Sorry, this chat does not belong to you \ntherefore you CANNOT ADD MESSAGES TO IT.");
        onSetProcessing(false);
        return false;
    }
    
    setMessages([addingMessage.message, ...messages]);
    setInput('');
    onSetProcessing(false);
    inputRef.current.focus();
  };

  
  
  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);
    const updatingMessage = await API.put(
        "api",
        "/message",
        {
            body: { 
                chatId: id,
                content
             },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                  .getAccessToken()
                  .getJwtToken()}`,
              },
        }
    );

    if (updatingMessage.error) {
        alert("Sorry, this chat does not belong to you \ntherefore you CANNOT UPDATE ITS MESSAGES.");
        onSetProcessing(false);
        return false;
    }
    
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, content } : msg);
    setMessages(updatedMessages);
    onSetProcessing(false);
    return true;
  }


  const handleMessageDelete = async (id) => {
    onSetProcessing(true);

    const deletingMessage = await API.del(
        "api",
        `/message/${id}`,
        { 
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                  .getAccessToken()
                  .getJwtToken()}`,
              },
        }
    );

    if (deletingMessage.error) {
        alert("Sorry, this chat does not belong to you \ntherefore you CANNOT DELETE ITS MESSAGES.");
        onSetProcessing(false);
        return false;
    }
    
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    onSetProcessing(false);
    inputRef.current.focus();
  }


  const handleEnter = ev => {
    if (ev.key === "Enter") handleSend();
  }


  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
          ref={inputRef}
          onKeyDown={handleEnter}
          autoFocus
        />
        <button
          onClick={handleSend}
          className={`ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded ${onProcessing ? "bg-orange-400" : ""}`}
          disabled={onProcessing}
        >
          {onProcessing ? "processing..." : "Send"}
          {/* Send */}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
