import React, { useEffect, useState } from "react";
import db from "./firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import "./displayData.css";

const DisplayData = () => {
  const [registrations, setRegistrations] = useState([]); // Store player registrations
  const [isAdmin, setIsAdmin] = useState(false); // Admin login state
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  }); // Admin credentials

  // Fetch data from Firestore using real-time listeners
  useEffect(() => {
    const fetchData = () => {
      const registrationsUnsub = onSnapshot(
        collection(db, "registrations"),
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRegistrations(data);
        },
        (error) => {
          console.error("Error fetching registrations:", error.message);
        }
      );

      return () => registrationsUnsub(); // Cleanup listener
    };

    fetchData();
  }, []);

  // Handle admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const { username, password } = adminCredentials;
    if (username === "mahaveer" && password === "mahaveer") {
      setIsAdmin(true);
      alert("Admin login successful!");
    } else {
      alert("Invalid credentials! Please try again.");
    }
  };

  // Approve a player and move to 'approved_players'
  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "registrations", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Player not found in 'registrations' collection.");
        return;
      }

      const playerData = docSnap.data();
      await setDoc(doc(db, "approved_players", id), playerData);
      await deleteDoc(docRef); // Remove from registrations
      alert("Player approved!");
    } catch (error) {
      console.error("Error approving player:", error.message);
    }
  };

  // Delete a player from 'registrations'
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "registrations", id));
      alert("Player deleted successfully!");
    } catch (error) {
      console.error("Error deleting player:", error.message);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Player Registrations</h2>

      {/* Admin Login Form */}
      {!isAdmin && (
        <form
          onSubmit={handleAdminLogin}
          style={{
            maxWidth: "300px",
            margin: "20px auto",
            textAlign: "center",
          }}
        >
          <h3>Admin Login</h3>
          <input
            type="text"
            placeholder="Username"
            value={adminCredentials.username}
            onChange={(e) =>
              setAdminCredentials({ ...adminCredentials, username: e.target.value })
            }
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminCredentials.password}
            onChange={(e) =>
              setAdminCredentials({ ...adminCredentials, password: e.target.value })
            }
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
          <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
            Login
          </button>
        </form>
      )}

      {/* Display Registered Players */}
      {registrations.length > 0 && (
        <div>
          <h3 style={{ textAlign: "center" }}>Registered Players</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                {isAdmin && (
                  <>
                    <th style={{ border: "1px solid black", padding: "8px" }}>
                      Father's Name
                    </th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Class</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>
                      School
                    </th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Role</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {registrations.map((player) => (
                <tr key={player.id}>
                  <td
                    data-label="Name"
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {player.name}
                  </td>
                  {isAdmin && (
                    <>
                      <td data-label="Father's Name">{player.fatherName}</td>
                      <td data-label="Class">{player.class}</td>
                      <td data-label="School">{player.school}</td>
                      <td data-label="Role">{player.role}</td>
                      <td data-label="Actions">
                        <button onClick={() => handleApprove(player.id)}>Approve</button>
                        <button onClick={() => handleDelete(player.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayData;
