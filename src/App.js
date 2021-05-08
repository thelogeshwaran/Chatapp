import "./App.css";
import Sidebar from "./Sidebar/Sidebar";
import Chatbox from "./Chatbox/Chatbox";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Authentication from "./Authentication/Authentication";
import { useAuthProvider } from "./Context/AuthProvider";
import LeftPopup from "./LeftPopup/LeftPopup";
import { usePopupProvider } from "./Context/PopupProvider";
import Modal from "./Components/Modal/Modal";

function App() {
  const { user } = useAuthProvider();
  const { selected } = usePopupProvider();
  // const user = false

  return (
    <div className="App">
      {!user ? (
        <Authentication />
      ) : (
        <div>
          <BrowserRouter>
            <Switch>
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
            </Switch>
          </BrowserRouter>
          { selected &&  <Modal/>}
        </div>
      )}

      
     
    </div>
  );
}

export default App;
