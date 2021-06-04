import "./App.css";
import { usePopupProvider } from "./Context/PopupProvider";
import { Route, Routes } from "react-router-dom";
import Authentication from "./Authentication/Auth/Authentication";
import { useAuthProvider } from "./Context/AuthProvider";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import Modal from "./Components/Common/Modal/Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useAuthProvider();
  const { selected } = usePopupProvider();

  return (
    <div className="App">
      <ToastContainer limit={3} />
      <div>
        <Routes>
          <Route path="/rooms/:roomId">
            <ChatPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <Authentication />
          </Route>
        </Routes>

        {selected && <Modal />}
      </div>
    </div>
  );
}

export default App;
