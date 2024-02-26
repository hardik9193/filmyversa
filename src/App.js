import AddMovie from "./components/AddMovie";
import Cards from "./components/Cards";
import Detail from "./components/Detail";
import Header from "./components/Header";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { createContext, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import { getAuth } from "firebase/auth";


const auth = getAuth();

const Appstate = createContext();
function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  console.log(login);
  console.log(username);


  return (
    <Appstate.Provider value={{ login, username, setLogin, setUsername }}>
      <div className="App"  >
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/addmovie" element={<AddMovie />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Appstate.Provider>
  );
}

export default App;
export { Appstate }
