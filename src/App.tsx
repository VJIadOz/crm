import React, {useState} from 'react';
import './App.css';
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { ToastContainer } from "react-toastify";

function App() {
    const [triggerSearch, setTriggerSearch] = useState<string>("");
    return (
        <div className="App">
          <Header setTriggerSearch={setTriggerSearch}></Header>
            <Main triggerSearch={triggerSearch}></Main>
            <ToastContainer />
        </div>
      );
}

export default App;
