// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import UsersListPage from "./components/usersList/UsersListPage";
import CreateUser from "./components/createUser/CreateUser";
import EditUser from "./components/editUser/EditUser";
import DeleteUser from "./components/deleteUser/DeleteUser";

function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: "#f5f5f5", // light grey background
          minHeight: "100vh", // full viewport height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff", // white box
            borderRadius: "8px",
            padding: "40px",
            width: "100%",
            maxWidth: "1200px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/create" element={<CreateUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="/delete/:id" element={<DeleteUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
