import { useContext, useEffect, useState, useRef } from "react";
import { ConversationContext } from "../context/ConversationContext";
import { TiMessages } from "react-icons/ti";
import Message from "./Message";
import toast from "react-hot-toast";
import MessageInput from "./MessageInput";
import { SocketContext } from "../context/SocketContext";

export default function ConversationContainer() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef();
  const { socket } = useContext(SocketContext);

  // fetch messages
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/message/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setMessages(data);
        console.log(data);

      } catch (error) {
        toast.error(error);

      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation, messages.length]);

  const Messages = () => {
    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {
        setMessages([...messages, newMessage]);
      });
    }, [socket, setMessages, messages]);

    return (
      <div className='px-4 flex-1 overflow-y-auto'>
        {!loading &&
          messages.length > 0 &&
          messages.map((message) => (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          ))}

        {!loading && messages.length === 0 && (
          <p className='text-center text-2xl text-orange-300'>Send a message to start the conversation</p>
        )}
      </div>
    )
  };

  // auto scroll to the last message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: "instant" });
    }, 100);
  }, [messages]);

  const NoSelectedConversation = () => {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-600">
        <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
          <p>Welcome to Chat App</p>
          <p>Select a conversation to start messaging</p>
          <TiMessages className="text-3xl md:text-6xl text-center" />
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex flex-col bg-gray-700'>
      {!selectedConversation ? (
        <NoSelectedConversation />
      ) : (
        <>
          <div className='bg-slate-500 px-4 py-2 mb-2'>
            <span className='label-text'>To:</span>{" "}
            <span className='text-white font-bold'>{selectedConversation.fullName}</span>
          </div>
          <Messages />
          <MessageInput messages={messages} setMessages={setMessages} />
        </>
      )}
    </div>
  );
}