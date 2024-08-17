import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";

export default function Messages() {
  // const { loading, messages } = useGetMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    socket?.on("message", ({ message, conversationId }) => {
      selectedConversation?._id === conversationId && setSelectedConversation({ ...selectedConversation, messages: [...messages, message] })
    });
    return () => socket?.off("message");
  }, [socket, messages]);

  // scroll to last message when sending and receiving new message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [selectedConversation, socket, messages]);

  // return (
  //   <div className='px-4 flex-1 overflow-y-auto'>
  //     {!loading &&
  //       messages.length > 0 &&
  //       messages.map((message, index) => (
  //         <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
  //           <Message message={message} />
  //         </div>
  //       ))}

  //     {!loading && messages.length === 0 && (
  //       <p className='text-center text-2xl text-orange-300'>Send a message to start the conversation</p>
  //     )}
  //   </div>
  // )
  return (
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
  )
}