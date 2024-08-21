import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";
import EmptyConversation from "./EmptyConversation";
import { ConversationsContext } from "../contexts/ConversationsContext";

export default function Messages() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);
  const { setConversations } = useContext(ConversationsContext);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);

  // update components upon receiving new message
  useEffect(() => {
    socket?.on("message", ({ message, conversation }) => {
      console.log(`receive ${message._id} in ${conversation._id}`);
      if (selectedConversation?._id === conversation._id) {
        setSelectedConversation({ ...selectedConversation, messages: [...messages, message] });
      }
      // insert if new conversation otherwise update existing one
      setConversations(prevConvs => {
        const existingConversation = prevConvs.find(conv => conv._id === conversation._id);
        if (existingConversation) {
          return prevConvs.map(conv => conv._id === conversation._id ?
            { ...conv, messages: [...conv.messages, message] } : conv
          );
        } else {
          return [{ ...conversation }, ...prevConvs];
        }
      });
    });
    return () => socket?.off("message");
  }, [socket, messages]);

  // scroll to the last message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [selectedConversation, socket, messages]);

  return (
    <>
      {!selectedConversation ? (<EmptyConversation />) : (
        <div className='px-4 flex-1 overflow-y-auto'>
          {selectedConversation &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <Message message={message} />
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