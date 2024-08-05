import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import { ConversationContextProvider } from "../contexts/ConversationContext"

export default function Home() {
  return (
    <ConversationContextProvider>
      <div className="w-full h-full flex">
        <Sidebar />
        <ConversationContainer />
      </div>
    </ConversationContextProvider>
  )
}