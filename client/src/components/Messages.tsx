import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";
import EmptyConversation from "./EmptyConversation";
import { ConversationsContext } from "../contexts/ConversationsContext";
import { AuthContext } from "../contexts/AuthContext";
import useGetConversation from "../hooks/useGetConversation";

export default function Messages() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);
  const { setConversations } = useContext(ConversationsContext);
  const { authUser } = useContext(AuthContext);
  const [lastMessageSeen, setLastMessageSeen] = useState([]);
  const { getConversationById } = useGetConversation();

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // update receiving new message
    socket?.on("message", ({ message, conversation }) => {
      if (selectedConversation?._id === conversation._id) {
        // setSelectedConversation({ ...selectedConversation, messages: [...messages, message] });
        // setLastMessageSeen([...message.seen, authUser]);
        getConversationById(conversation._id); // refetch for simplicity
      }
      // update sidebar
      setConversations(prevConvs => [conversation, ...prevConvs
        .filter(conv => conv._id !== conversation._id)]
      );
    });

    // update last message seen
    socket?.on("read", ({ newSeen, conversation }) => {
      if (selectedConversation?._id === conversation._id) {
        setLastMessageSeen(newSeen);
      }
    });

    return () => {
      socket?.off("message");
      socket?.off("read");
    }
  }, [socket, messages]);

  useEffect(() => {
    setLastMessageSeen(messages.at(-1)?.seen);
  }, [selectedConversation, socket, messages]);

  // scroll to the last message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [selectedConversation, socket, messages, lastMessageSeen]);

  return (
    <>
      {!selectedConversation ? (<EmptyConversation />) : (
        <div className='px-4 flex-1 overflow-y-auto'>
          {selectedConversation &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <Message message={message} />
                {index === messages.length - 1 && lastMessageSeen && (
                  <div className="flex items-center mt-2 space-x-1 justify-end">
                    {lastMessageSeen.filter(user => user._id !== (authUser?._id) && user._id !== message.sender._id)
                      .map(user => (
                        <img
                          key={user._id}
                          src={user.profilePic}
                          className="w-5 h-5 rounded-full border-2 border-white"
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}

          {messages.length === 0 && (
            <p className='text-center text-2xl text-orange-300'>Send a message to start the conversation</p>
          )}
        </div>
      )}
    </>
  )
}