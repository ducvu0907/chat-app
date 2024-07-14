import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import UsersBar from "../components/UsersBar"
import { ConversationContextProvider } from "../context/ConversationContext"
import { UsersContextProvider } from "../context/FilteredUsersContext"

export default function Home() {
  return (
    <ConversationContextProvider>
      <div className="w-full h-full flex">
        <Sidebar />
        <ConversationContainer />
        <UsersContextProvider>
          <UsersBar />
        </UsersContextProvider>
      </div>
    </ConversationContextProvider>
  )
}