import React, { createContext, ReactNode, useState } from "react";

interface Conversation {
  _id: string;
  isGroup: boolean;
  participants: [];
  messages: [];
}

interface ConversationContextType {
  selectedConversation: Conversation | null;
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

export const ConversationContext = createContext<ConversationContextType>({ selectedConversation: null, setSelectedConversation: () => { } });

export function ConversationContextProvider({ children }: { children: ReactNode }) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return <ConversationContext.Provider value={{ selectedConversation, setSelectedConversation }}>
    {children}
  </ConversationContext.Provider>
}