import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Fight from "./pages/Fight"
import Admin from "./pages/Admin"

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
          <Route path="/dash" element={<Dashboard />}>
          </Route>
          <Route path="/fight" element={<Fight/>}>
          </Route>
          <Route path="/admin" element={<Admin/>}>
          </Route>
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;