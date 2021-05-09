import "./App.css";
import Sidebar from "./Sidebar/Sidebar";
import Chatbox from "./Chatbox/Chatbox";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./Authentication/Authentication";
import { useAuthProvider } from "./Context/AuthProvider";
import LeftPopup from "./Sidebar/LeftPopup/LeftPopup";
import { usePopupProvider } from "./Context/PopupProvider";
import Modal from "./Components/Modal/Modal";
import { ToastContainer } from 'react-toastify';

function App() {
  const { user } = useAuthProvider();
  const { selected } = usePopupProvider();


  return (
    <div className="App"> 
    <ToastContainer/> 
     {!user ? (
        <Authentication />
      ) : (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/rooms/:roomId">
                <div className="desktop__body">
                  <Sidebar />
                  <LeftPopup />
                  <Chatbox />
                </div>
                <div className="mob__body">
                  <Chatbox />
                </div>
              </Route>
              <Route path="/">
                <div className="desktop__body">
                  <Sidebar />
                  <LeftPopup />
                  <Chatbox />
                </div>
                <div className="mob__body">
                  <Sidebar />
                  <LeftPopup />
                </div>
              </Route>
            </Routes>
          </BrowserRouter>
          {selected && <Modal />}
        </div>
      )}
      
    </div>
  );
}

export default App;
