import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";
import useGetConversations from "../hooks/useGetConversations";
import EmptyConversation from "./EmptyConversation";

export default function Messages() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);
  const { setConversations } = useGetConversations();

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    socket?.on("message", ({ message, conversationId }) => {
      console.log(`receive ${message._id} in ${conversationId}`);
      selectedConversation?._id === conversationId && setSelectedConversation({ ...selectedConversation, messages: [...messages, message] })
      console.log(message);
      // FIXME: update sidebar messages
      setConversations(prevConvs => prevConvs.map(conv => conv._id === conversationId ?
        { ...conv, messages: [...conv.messages, message] } : conv)
      );
      console.log(conversations);
    });
    return () => socket?.off("message");
  }, [socket, messages]);

  // scroll down
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