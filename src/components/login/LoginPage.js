// src/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validEmail = "eve.holt@reqres.in";
    const validPassword = "cityslicka";

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("token", "dummy-local-token");
      if (rememberMe) {
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("rememberMe");
      }
      navigate("/users");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={titleStyle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label>Email:</label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Password:</label>
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={checkboxContainerStyle}>
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    style={checkboxStyle}
  />
  <label style={checkboxLabelStyle}>Remember Me</label>
</div>

          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Inline styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f4f4f4",
};

const boxStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
};

const titleStyle = {
  marginBottom: "20px",
  textAlign: "center",
};

const formGroupStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
  marginBottom: "10px",
  fontSize: "14px",
};
const checkboxContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "15px",
};

const checkboxStyle = {
  marginRight: "8px",
};

const checkboxLabelStyle = {
  fontSize: "14px",
};


export default LoginPage;
