import { createContext, useState } from "react";

export const ConversationContext = createContext(undefined);

export function ConversationContextProvider({ children }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return <ConversationContext.Provider value={{ selectedConversation, setSelectedConversation }}>
    {children}
  </ConversationContext.Provider>
}