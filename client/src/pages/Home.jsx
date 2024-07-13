import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import { ConversationContextProvider } from "../context/ConversationContext"

export default function Home() {
  return (
    <ConversationContextProvider>
      <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar />
        <ConversationContainer />
      </div>
    </ConversationContextProvider>
  )
}