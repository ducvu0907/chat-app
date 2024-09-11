import ConversationContainer from "../components/ConversationContainer"
import Sidebar from "../components/Sidebar"
import UsersBar from "../components/UsersBar"

export default function Home() {
  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <ConversationContainer />
      <UsersBar />
    </div>
  )
}