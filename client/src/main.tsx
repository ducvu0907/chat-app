import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext.tsx';
import { ConversationContextProvider } from './contexts/ConversationContext.tsx';
import { ConversationsContextProvider } from './contexts/ConversationsContext.tsx';
import { SocketContextProvider } from './contexts/SocketContext.tsx';
import { UsersContextProvider } from './contexts/UsersContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ConversationsContextProvider>
          <ConversationContextProvider>
            <SocketContextProvider>
              <UsersContextProvider>
                <App />
              </UsersContextProvider>
            </SocketContextProvider>
          </ConversationContextProvider>
        </ConversationsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
