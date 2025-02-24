import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";
import EmptyConversation from "./EmptyConversation";
import { ConversationsContext } from "../contexts/ConversationsContext";
import { AuthContext } from "../contexts/AuthContext";
// import useGetConversation from "../hooks/useGetConversation";

export default function Messages() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedConversation } = useContext(ConversationContext) as any;
  const [messages, setMessages] = useState<any[]>([]);
  const { socket } = useContext(SocketContext);
  const { setConversations } = useContext(ConversationsContext) as any;
  const { authUser } = useContext(AuthContext) as any;
  const [lastMessageSeen, setLastMessageSeen] = useState<any[]>([]);
  // const { getConversationById } = useGetConversation();

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // update new message
    socket?.on("message", async ({ message, conversation }: any) => {
      if (selectedConversation?._id === conversation._id) {
        console.log("New message received", message);
        setMessages(prevMessages => [...prevMessages, message]);
        // getConversationById(conversation._id);
        conversation.messages.at(-1).seen.push(authUser);
      }
      // update sidebar
      setConversations((prevConvs: any[]) => [
        conversation,
        ...prevConvs.filter((conv: any) => conv._id !== conversation._id),
      ]);
    });

    // update last message seen
    socket?.on("read", ({ newSeen, conversation }: any) => {
      if (selectedConversation?._id === conversation._id) {
        setLastMessageSeen(newSeen);
      }
    });

  }, [socket, socket?.on, messages]);

  useEffect(() => {
    setLastMessageSeen((messages.at(-1) as any)?.seen);
  }, [selectedConversation, socket, messages]);

  // scroll to the last message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [selectedConversation, socket, messages, lastMessageSeen]);

  return (
    <>
      {!selectedConversation ? (
        <EmptyConversation />
      ) : (
        <div className="px-4 flex-1 overflow-y-auto">
          {selectedConversation &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <Message message={message} />
                {index === messages.length - 1 && lastMessageSeen && (
                  <div className="flex items-center mt-2 space-x-1 justify-end">
                    {lastMessageSeen
                      .filter(
                        (user: any) =>
                          user._id !== (authUser?._id) && user._id !== (message as any).sender._id
                      )
                      .map((user: any) => (
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
            <p className="text-center text-2xl text-orange-300">Send a message to start the conversation</p>
          )}
        </div>
      )}
    </>
  );
}
