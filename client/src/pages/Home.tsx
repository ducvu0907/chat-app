import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import UsersBar from "../components/UsersBar"
import { ConversationContextProvider } from "../contexts/ConversationContext"
import { ConversationsContextProvider } from "../contexts/ConversationsContext"
import { SocketContextProvider } from "../contexts/SocketContext"
import { UsersContextProvider } from "../contexts/UsersContext"

export default function Home() {
  return (
    <ConversationContextProvider>
      <SocketContextProvider>
        <UsersContextProvider>
          <ConversationsContextProvider>
            <div className="w-full h-full flex">
              <Sidebar />
              <ConversationContainer />
              <UsersBar />
            </div>
          </ConversationsContextProvider>
        </UsersContextProvider>
      </SocketContextProvider>
    </ConversationContextProvider>
  )
}