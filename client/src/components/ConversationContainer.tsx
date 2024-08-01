import { useContext, useEffect, useState, useRef } from "react";
import { ConversationContext } from "../context/ConversationContext";
import { TiMessages } from "react-icons/ti";
import Message from "./Message";
import toast from "react-hot-toast";
import MessageInput from "./MessageInput";
import { SocketContext } from "../context/SocketContext";

export default function ConversationContainer() {

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