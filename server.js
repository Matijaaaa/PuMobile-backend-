import express from "express";
import "dotenv/config";
import dbConnect from "./db";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to PuMobile API");
});

// Reservation route
app.post("/app/reservation", async (req, res) => {
  try {
    const db = await dbConnect();

    // Use the 'reservations' collection
    const reservationsCollection = db.collection("reservations");

    // Extract reservation data from the request body
    const {
      selectedLocation,
      selectedLocation2,
      selectedTime,
      selectedPickupTime,
      selectedDropOffTime,
      cardNumber,
      expirationDate,
      cardHolder,
    } = req.body;

    // Validate and sanitize data as needed

    // Insert the reservation data into MongoDB
    const result = await reservationsCollection.insertOne({
      selectedLocation,
      selectedLocation2,
      selectedTime,
      selectedPickupTime,
      selectedDropOffTime,
      cardNumber,
      expirationDate,
      cardHolder,
    });

    // Respond with a success message or the inserted document
    res
      .status(201)
      .json({ message: "Reservation saved successfully", data: result.ops[0] });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
