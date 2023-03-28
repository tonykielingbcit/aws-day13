import { useRef, useState } from 'react';
import { useAuthenticator } from "@aws-amplify/ui-react";

const NewChatButton = ({ onCreate, processing }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const { user } = useAuthenticator((context) => [context.user]);

  const handleCreate = () => {
    if (name.trim() !== '') {
      onCreate(name);
      setName('');
      setIsCreating(false);
    } else inputRef.current.focus();
  };


  const handleEnter = ev => {
    if (ev.key === "Enter")
      handleCreate();
  }

  const handleClick = () => {
    if (!user) {
        alert("Login first, please");
        return;
    }

    setIsCreating(true);
  };


  return (
    <>
      {isCreating ? (
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Chat name..."
            ref={inputRef}
            onKeyDown={handleEnter}
            autoFocus
          />
          <button
            onClick={handleCreate}
            className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="ml-2 px-4 py-2 bg-red-500 text-white font-semibold rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
        //   onClick={() => setIsCreating(true)}
          onClick={handleClick}
          className={`w-full px-4 py-2 mt-4 text-white bg-green-500 font-semibold rounded ${processing ? "bg-orange-400" : ""}`}
          disabled={processing}
        >
          {processing ? "processing..." : "New Chat"}
          {/* {processing ? "processing..." : notLogged ? "Login first, please" : "New Chat"} */}
        </button>
      )}
    </>
  );
};

export default NewChatButton;

