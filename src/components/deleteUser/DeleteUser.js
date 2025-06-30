// src/DeleteUser.js
import React from "react";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/usersSlice"; // ✅ Import your Redux action

function DeleteUser({ user, onCancel }) {
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(deleteUser(user.id));
    onCancel(); // Close the modal after delete
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete this user?<br />
          <strong>ID:</strong> {user.id}<br />
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <button onClick={handleConfirm} style={confirmButtonStyle}>
          Confirm
        </button>
        <button onClick={onCancel} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  border: "1px solid #333",
  padding: "30px",
  borderRadius: "8px",
  textAlign: "center",
  width: "300px",
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
};

const confirmButtonStyle = {
  background: "#d9534f",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  marginRight: "10px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  background: "#aaa",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  cursor: "pointer",
};

export default DeleteUser;
