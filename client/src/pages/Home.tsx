import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import UsersBar from "../components/UsersBar"
import { ConversationContextProvider } from "../contexts/ConversationContext"
import { UsersContextProvider } from "../contexts/UsersContext"

export default function Home() {
  return (
    <ConversationContextProvider>
      <UsersContextProvider>
        <div className="w-full h-full flex">
          <Sidebar />
          <ConversationContainer />
          <UsersBar />
        </div>
      </UsersContextProvider>
    </ConversationContextProvider>
  )
}