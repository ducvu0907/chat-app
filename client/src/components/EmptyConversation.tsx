import { TiMessages } from "react-icons/ti";

export default function EmptyConversation() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-600">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Select a conversation to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
}