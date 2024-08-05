import Messages from "./Messages";
import MessageInput from "./MessageInput";

export default function ConversationContainer() {
  return (
    <div className='w-full flex flex-col bg-gray-700'>
      <div className='bg-slate-500 px-4 py-2 mb-2'>
      </div>
      <Messages />
      {/* <MessageInput messages={messages} setMessages={setMessages} /> */}
    </div>
  );
}