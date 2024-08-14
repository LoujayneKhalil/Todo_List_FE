// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminScreen from "./components/AdminScreen";
import UserScreen from "./components/UserScreen";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/user" element={<UserScreen />} />
          <Route path="/" element={<UserScreen />} />{" "}
          {/* Default to UserScreen */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
