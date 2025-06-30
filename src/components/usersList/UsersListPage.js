import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteUser from "../deleteUser/DeleteUser";
import { deleteUser, fetchUsers } from "../../redux/usersSlice";
import "./UsersListPage.css";

function UsersListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get users, status & error from store
  const users = useSelector((state) => state.users.list);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 6;

  // ✅ Fetch users on first load if needed
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleCreate = () => navigate("/create");
  const handleEdit = (id) => navigate(`/edit/${id}`);

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const confirmDelete = (id) => {
    dispatch(deleteUser(id));
    setShowDelete(false);
    setSelectedUser(null);

    const updatedUsers = filteredUsers.length - 1;
    const updatedTotalPages = Math.max(1, Math.ceil(updatedUsers / usersPerPage));
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }
  };

  const cancelDelete = () => {
    setShowDelete(false);
    setSelectedUser(null);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={searchInputStyle}
          />
          <button style={createButtonStyle} onClick={handleCreate}>
            Create User
          </button>
        </div>
      </div>

      {showDelete && selectedUser && (
        <DeleteUser
          user={selectedUser}
          onConfirm={() => confirmDelete(selectedUser.id)}
          onCancel={cancelDelete}
        />
      )}

      <div style={viewToggleContainerStyle}>
        <button
          style={{
            ...toggleButtonStyle,
            backgroundColor: viewMode === "table" ? "#007BFF" : "#fff",
            color: viewMode === "table" ? "#fff" : "#007BFF",
          }}
          onClick={() => setViewMode("table")}
        >
          Table View
        </button>
        <button
          style={{
            ...toggleButtonStyle,
            backgroundColor: viewMode === "card" ? "#007BFF" : "#fff",
            color: viewMode === "card" ? "#fff" : "#007BFF",
          }}
          onClick={() => setViewMode("card")}
        >
          Card View
        </button>
      </div>

      {status === "loading" && <p style={{ textAlign: "center" }}>Loading users...</p>}
      {status === "failed" && (
        <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>
      )}
      {status === "succeeded" && filteredUsers.length === 0 && (
        <p style={{ textAlign: "center" }}>No users found.</p>
      )}

      {status === "succeeded" && filteredUsers.length > 0 && (
        <>
          {viewMode === "table" ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Profile</th>
                  <th style={thStyle}>First Name</th>
                  <th style={thStyle}>Last Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={tdStyle}>
                      <img
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </td>
                    <td style={tdStyle}>{user.firstName}</td>
                    <td style={tdStyle}>{user.lastName}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(user.id)} style={buttonStyle}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        style={{ ...buttonStyle, backgroundColor: "#f44336" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={cardContainerStyle}>
              {currentUsers.map((user) => (
                <div key={user.id} style={cardStyle} className="user-card">
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    style={cardImgStyle}
                  />
                  <h4 style={{ margin: "10px 0 5px" }}>
                    {user.firstName} {user.lastName}
                  </h4>
                  <p style={{ margin: "0 0 10px" }}>{user.email}</p>
                  <div className="overlay-actions">
                    <button onClick={() => handleEdit(user.id)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={paginationContainerStyle}>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              style={{
                ...paginationButtonStyle,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  ...paginationButtonStyle,
                  backgroundColor: currentPage === i + 1 ? "#007BFF" : "#fff",
                  color: currentPage === i + 1 ? "#fff" : "#007BFF",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                ...paginationButtonStyle,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}


// ✅ Inline styles stay the same
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "0 auto 20px",
  padding: "0 20px",
};

const searchInputStyle = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginLeft: "5px",
  marginRight: "10px",
};

const createButtonStyle = {
  padding: "8px 16px",
  fontSize: "14px",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};

const viewToggleContainerStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "0 auto 20px",
  padding: "0 20px",
};

const toggleButtonStyle = {
  margin: "0 5px",
  padding: "8px 16px",
  cursor: "pointer",
  borderRadius: "4px",
  border: "1px solid #007BFF",
};

const tableStyle = {
  margin: "0 auto",
  borderCollapse: "collapse",
  width: "100%",
};

const thStyle = {
  textAlign: "center",
  padding: "12px 8px",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  textAlign: "center",
  padding: "12px 8px",
  borderBottom: "1px solid #ddd",
};

const buttonStyle = {
  margin: "5px",
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};

const cardContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: "20px",
  maxWidth: "1200px",
  margin: "20px auto 0",
  padding: "0 20px",
};

const cardStyle = {
  flex: "0 0 calc(33.33% - 20px)",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  position: "relative",
  paddingBottom: "15px",
  transition: "transform 0.2s ease",
};

const cardImgStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  marginTop: "15px",
};

const paginationContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  maxWidth: "1200px",
  margin: "30px auto 0",
  padding: "0 20px",
  gap: "8px",
};

const paginationButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #007BFF",
  borderRadius: "4px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  color: "#007BFF",
};

export default UsersListPage;
