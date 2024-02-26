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
app.use(express.json()); //dekodira json poruke

app.get("/", (req, res) => {
  res.send("Welcome to PuMobile API");
});

app.post("/app/reservation", async (req, res) => {
  try {
    const db = await dbConnect();

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

    // Insert MongoDB
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
    console.log("Result:", result);

    res.status(201).json({
      message: "Reservation saved successfully",
      data: result.insertedId ? result.insertedId : null,
    });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
