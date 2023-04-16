import "./App.css";
import React, { Component } from "react";
import { Router, Route, Routes } from "react-router-dom";
import Giris from "./pages/Giris";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

class App extends Component {
  render() {
    return (
      <div>
        
          <Routes>
            <Route path="/" element={<Giris />}></Route>
            <Route path="/home" element={<Home />}></Route>
            
          </Routes>
        
      </div>
    );
  }
}
export default App;
