import React, { createContext } from "react";
import Navigation from "./components/Navigation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import LogOut from "./components/LogOut";
import { UpdateContext, useForceUpdate } from "./myFunctions";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile";
import Movies from "./components/Movies";
import MovieDetail from "./components/MovieDetail";

const App: React.FC = () => {
  const forceUpdate = useForceUpdate();

  const update = function() {
    forceUpdate();
  };

  return (
    <div className="container">
      <UpdateContext.Provider value={forceUpdate}>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </UpdateContext.Provider>
    </div>
  );
};

export default App;
