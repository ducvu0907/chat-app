import { FaUsers } from 'react-icons/fa';
import useCreateGroupConversation from '../hooks/useCreateGroupConversation';
import { ChangeEvent, useContext, useState } from 'react';
import { UsersContext } from '../contexts/UsersContext';
import { AuthContext } from '../contexts/AuthContext';

export default function CreateGroupConversationButton() {
  const [toggleAdd, setToggleAdd] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>("");
  const { authUser } = useContext(AuthContext);
  const [participants, setParticipants] = useState([]);
  const { loading, createGroupConversation } = useCreateGroupConversation();
  const { users } = useContext(UsersContext);
  const [suggestions, setSuggestions] = useState([]);

  const handleCancel = () => {
    setToggleAdd(false);
    setParticipants([]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setInputName(name);
    if (name) {
      const filteredSuggestions = users.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddParticipant = (user) => {
    if (user && !participants.some(p => p._id === user._id)) {
      setParticipants([...participants, user]);
    }
    setInputName("");
    setSuggestions([]);
  };

  const handleCreateGroupConversation = async () => {
    await createGroupConversation([...participants, authUser]);
    setParticipants([]);
    setToggleAdd(false);
  };

  return (
    <div className="flex justify-center mb-4">
      {toggleAdd ? (
        <div className="flex flex-col items-center mt-2">
          <input type="text" value={inputName} onChange={handleInputChange} placeholder="Type a user name" className="mb-2 p-1 border border-gray-300 rounded" />
          {suggestions.length > 0 && (
            <ul className="w-full border border-gray-300 bg-amber-500 rounded shadow-lg max-h-60 overflow-auto">
              {suggestions.map(user => (
                <li key={user._id} onClick={() => handleAddParticipant(user)} className="p-2 cursor-pointer hover:bg-gray-500">
                  {user.name}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2">
            {participants.map(participant => (
              <div key={participant._id} className="p-1 border border-gray-300 rounded mb-1">
                {participant.name}
              </div>
            ))}
          </div>
          <button onClick={handleCreateGroupConversation} className="mt-2 p-2 bg-green-500 text-white rounded" disabled={loading} >
            Create group
            {loading && <span className="loading-spinner"></span>}
          </button>
          <button onClick={handleCancel} className='mt-2 p-2 bg-red-500 text-white rounded'>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setToggleAdd(true)} className="p-2 rounded-full bg-slate-700 text-white m-1" >
          <FaUsers size={24} />
        </button>
      )}
    </div>
  );
}