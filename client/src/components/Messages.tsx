import { useEffect, useRef } from "react";
import useGetMessages from "../hooks/useGetMessages"
import Message from "./Message";

export default function Messages() {
  const { loading, messages } = useGetMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null); // auto-scroll to the div containing last message

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  }, [messages]);

  return (
    <div className='px-4 flex-1 overflow-y-auto'>
      {!loading &&
        messages.length > 0 &&
        messages.map((message, index) => (
          <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className='text-center text-2xl text-orange-300'>Send a message to start the conversation</p>
      )}
    </div>
  )
}