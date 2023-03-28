import { useRef, useState } from 'react';
import { EditIcon, TrashIcon } from './Icons';
import { useAuthenticator } from "@aws-amplify/ui-react";


const MessageItem = ({ message, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const isUser = message.sender === 'user';
  const inputRef = useRef(null);
  const tempMessage = message.content;

  const { user } = useAuthenticator(context => [context.user]);

  const handleUpdate = async () => {
    const updatingMessage = await onUpdate(message.id, content);
    if (!updatingMessage)
        setContent(tempMessage);

    setIsEditing(false);
  };


  const handleDelete = async () => {
    const deletingMessage = await onDelete(message.id);

    if (!deletingMessage)
        setContent(tempMessage);
  };


  const FormatedDtTm = () => {
    const dt = new Date(message.timestamp)
    const dtOptions = {  
        year: "numeric", month: "short", day: "numeric"
      };  
    const tmOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const dateToDisplay = `${dt.toLocaleDateString('en-US', dtOptions)} - ${dt.toLocaleTimeString("en-US", tmOptions)}`;
    return <span className="mr-1 italic text-xs font-semibold text-orange-600">{dateToDisplay}</span>;
  }


  const handleEnter = ev => {
    if (ev.key === "Enter") handleUpdate();
  }


  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : ''}`}>
    <div className="p-2 my-1 w-full">
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow p-1 border rounded"
            onKeyDown={handleEnter}
            ref={inputRef}
            autoFocus
          />
          <button onClick={handleUpdate} className="ml-2 px-2 py-1 bg-green-500 text-white font-semibold rounded">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="ml-2 px-2 py-1 bg-red-500 text-white font-semibold rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div
        className={`px-4 py-2 rounded ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
      
        <div className="flex items-center">
          <span className="flex-grow">{content}</span>
          <FormatedDtTm />

          {user &&
            <>
                {/* <button onClick={() => setIsEditing(true)} disabled={notLogged} className="px-1 text-gray-600 hover:text-gray-800"> */}
                <button onClick={() => setIsEditing(true)} className="px-1 text-gray-600 hover:text-blue-500">
                    <EditIcon />
                </button>
                <button onClick={handleDelete} className="px-1 text-gray-600 hover:text-red-500">
                    <TrashIcon />
                </button>
            </>
          }
        </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default MessageItem;
