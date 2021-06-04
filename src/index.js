import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from "./Context/AuthProvider";
import { PopupProvider } from "./Context/PopupProvider";
import { MessagesProvider } from "./Context/MessagesProvider";
import { BrowserRouter } from "react-router-dom";



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <PopupProvider>
        <MessagesProvider>
        <App />
        </MessagesProvider>
      </PopupProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

