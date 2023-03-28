import { useState } from 'react';

import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatGPT = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [processing, setProcessing] = useState(false);

  return (
    // <div className="flex bg-lime-800 grow">
    <div className="flex grow">
      <div className="w-2/5 p-4 border-r border-slate-400 md:w-1/3">
        <ChatList onSelect={setSelectedChat} selectedChat={selectedChat} onSetSelectedChat={setSelectedChat}
            onProcessing={processing} onSetProcessing={setProcessing} />
      </div>
      <div className="w-3/5 p-4">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onProcessing={processing} onSetProcessing={setProcessing} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-lg font-semibold text-gray-600">Select or Create a chat to start the conversation</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPT;
