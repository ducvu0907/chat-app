import React, { createContext, ReactNode, useState } from "react";

interface ConversationContextType {
  selectedConversation: {} | null;
  setSelectedConversation: React.Dispatch<React.SetStateAction<any>>;
}

export const ConversationContext = createContext<ConversationContextType>({ selectedConversation: null, setSelectedConversation: () => { } });

export function ConversationContextProvider({ children }: { children: ReactNode }) {
  const [selectedConversation, setSelectedConversation] = useState<{} | null>(null);

  return <ConversationContext.Provider value={{ selectedConversation, setSelectedConversation }}>
    {children}
  </ConversationContext.Provider>
}