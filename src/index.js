import express from "express";
import dbConnect from "./db.js";
import "dotenv/config";
import cors from "cors";

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

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
    const reservationsCollection = db.collection("Reservations");
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

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
