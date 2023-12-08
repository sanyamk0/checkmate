import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from './app/store.js';
import App from './App.tsx'
import './index.css'
import { SocketProvider } from './contexts/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
)
