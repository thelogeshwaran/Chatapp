import "./App.css";
import { usePopupProvider } from "./Context/PopupProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./Authentication/Authentication";
import { useAuthProvider } from "./Context/AuthProvider";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import Modal from "./Components/Modal/Modal";

function App() {
  const { user } = useAuthProvider();
  const { selected } = usePopupProvider();

  return (
    <div className="App">
      {!user ? (
        <Authentication />
      ) : (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/rooms/:roomId">
                <ChatPage/>
              </Route>
              <Route path="/">
                <HomePage />
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
