import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from "./Context/AuthProvider";
import { PopupProvider } from "./Context/PopupProvider";
import { MessagesProvider } from "./Context/MessagesProvider";



ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <PopupProvider>
        <MessagesProvider>
        <App />
        </MessagesProvider>
      </PopupProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

