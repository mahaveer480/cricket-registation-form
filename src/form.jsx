import React, { useState } from "react";
import db from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./form.css";
import DisplayData from "./showdata";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    class: "",
    school: "",
    role: "player",
  });

  const [totalFee, setTotalFee] = useState(200);
  const [uniqueID, setUniqueID] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "role") {
      setTotalFee(value === "captain" ? 500 : 200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate a random unique ID
      const id = crypto.randomUUID();

      // Prepare data for Firestore
      const registrationData = {
        id, // Add unique ID to data
        name: formData.name,
        fatherName: formData.fatherName,
        class: formData.class,
        school: formData.school,
        role: formData.role,
        totalFee,
        timestamp: serverTimestamp(),
      };

      // Save data to Firestore
      await addDoc(collection(db, "registrations"), registrationData);

      setUniqueID(id); // Store unique ID to display
      alert(`Form submitted successfully! Your unique ID is: ${id}`);

      // Reset form
      setFormData({
        name: "",
        fatherName: "",
        class: "",
        school: "",
        role: "player",
      });
      setTotalFee(200);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px",width:'100%', margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <div
        className="animated-message"
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid green",
          borderRadius: "5px",
          backgroundColor: "#e0ffe0",
          fontSize: "16px",
        }}
      >
        <p>
          Please complete your registration by sending your payment of <strong>{totalFee} Rupees</strong> to this number: <strong>3492439953</strong>.
        </p>
        <p>
          After making the payment, share the following items via WhatsApp to the same number:
        </p>
        <ul>
          <li>Your unique ID: <strong>{uniqueID}</strong></li>
          <li>A screenshot of the payment confirmation</li>
          <li>A recent photo of yourself</li>
        </ul>
        <p>
          Thank you for registering, and we look forward to seeing you soon!
        </p>
      </div>






      <h2>Player Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
        </label>

        <label>
          Father's Name
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Enter your father's name"
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
        </label>

        <label>
          Class
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="Enter your class"
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
        </label>

        <label>
          School Name
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            placeholder="Enter your school name"
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          />
        </label>

        <label>
          Role
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginBottom: "15px" }}
          >
            <option value="player">Player</option>
            <option value="captain">Captain</option>
          </select>
        </label>

        <div style={{ fontWeight: "bold", color: "green", marginBottom: "15px" }}>
          Total Fee: {totalFee} Rupees
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Submit
        </button>
      </form>

 
<br />
      <DisplayData />
    </div>
  );
};

export default RegistrationForm;
