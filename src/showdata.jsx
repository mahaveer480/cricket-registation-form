import React, { useEffect, useState } from "react";
import db from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./displayData.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DisplayData = () => {
  const [registrations, setRegistrations] = useState([]); // Store unapproved players
  const [approvedPlayers, setApprovedPlayers] = useState([]); // Store approved players
  const [isAdmin, setIsAdmin] = useState(false); // Admin login state
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  }); // Admin credentials

  // Fetch data from Firestore using real-time listeners
  useEffect(() => {
    const fetchData = () => {
      // Listen for changes in 'registrations' collection
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

      // Listen for changes in 'approved_players' collection
      const approvedPlayersUnsub = onSnapshot(
        collection(db, "approved_players"),
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setApprovedPlayers(data);
        },
        (error) => {
          console.error("Error fetching approved players:", error.message);
        }
      );

      // Cleanup listeners on component unmount
      return () => {
        registrationsUnsub();
        approvedPlayersUnsub();
      };
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

  // Approve a player and move their data to 'approved_players'
  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "registrations", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Player not found in 'registrations' collection.");
        return;
      }

      const playerData = docSnap.data();

      // Add player data to 'approved_players' collection
      await setDoc(doc(db, "approved_players", id), playerData);

      // Remove player from 'registrations' collection
      await deleteDoc(docRef);

      alert("Player approved and moved to approved players!");
    } catch (error) {
      console.error("Error approving player:", error.message);
    }
  };

  // Delete a player from 'registrations'
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "registrations", id)); // Remove from registrations
      alert("Player deleted successfully!");
    } catch (error) {
      console.error("Error deleting player:", error.message);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    const classCounts = {};
    approvedPlayers.forEach((player) => {
      classCounts[player.class] = (classCounts[player.class] || 0) + 1;
    });

    return {
      labels: Object.keys(classCounts),
      datasets: [
        {
          label: "Number of Approved Players by Class",
          data: Object.values(classCounts),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="container">
      {/* Show Player Counts */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Registered Players: {registrations.length}</h3>
        <h3>Approved Players: {approvedPlayers.length}</h3>
      </div>

      {/* Show Approved Players */}
      <h2>Approved Players</h2>
      <div className="box-container">
        {approvedPlayers.map((player) => (
          <div key={player.id} className="box">
            <h3>{player.name}</h3>
            <p>
              <strong>Father's Name:</strong> {player.fatherName}
            </p>
            <p>
              <strong>Class:</strong> {player.class}
            </p>
            <p>
              <strong>School:</strong> {player.school}
            </p>
            <p>
              <strong>Role:</strong> {player.role}
            </p>
            <p>
              <strong>Total Fee:</strong> {player.totalFee} Rupees
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {player.timestamp?.toDate().toLocaleString() || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Show Chart of Approved Players */}
      {approvedPlayers.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Approved Players Chart</h2>
          <Bar data={prepareChartData()} />
        </div>
      )}

      {/* Admin Login Form if not an Admin */}
      {!isAdmin && (
        <form
          onSubmit={handleAdminLogin}
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            textAlign: "center",
          }}
        >
          <h2>Admin Login</h2>
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

      {/* Show Registered Players for Admin */}
      {isAdmin && (
        <>
          <h2>Registered Players (Admin View)</h2>
          <div className="box-container">
            {registrations.map((player) => (
              <div key={player.id} className="box">
                <h3>{player.name}</h3>
                <p>
                  <strong>Father's Name:</strong> {player.fatherName}
                </p>
                <p>
                  <strong>Class:</strong> {player.class}
                </p>
                <p>
                  <strong>School:</strong> {player.school}
                </p>
                <p>
                  <strong>Role:</strong> {player.role}
                </p>
                <p>
                  <strong>Total Fee:</strong> {player.totalFee} Rupees
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {player.timestamp?.toDate().toLocaleString() || "N/A"}
                </p>
                <div>
                  <button
                    onClick={() => handleApprove(player.id)}
                    style={{
                      padding: "5px 10px",
                      marginRight: "10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayData;
