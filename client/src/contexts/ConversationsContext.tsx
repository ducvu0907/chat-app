import React from "react";
import { createContext, ReactNode, useState } from "react";

interface ConversationsContextType {
  conversations: [];
  setConversations: React.Dispatch<React.SetStateAction<[]>>;
}

export const ConversationsContext = createContext<ConversationsContextType>({ conversations: [], setConversations: () => { } });

export function ConversationsContextProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<[]>([]);

  return <ConversationsContext.Provider value={{ conversations, setConversations }}>
    {children}
  </ConversationsContext.Provider>
}