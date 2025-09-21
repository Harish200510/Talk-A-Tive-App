import "./App.css"
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact/>
        <Route path="/chats" element={<ChatPage/>} exact/>
      </Routes>
    </div>
  );
}

export default App;
