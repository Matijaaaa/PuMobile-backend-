import express from "express";
import dbConnect from "./db.js";
import "dotenv/config";
import cors from "cors";
import auth from "./auth.js";

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

app.post("/users", async (req, res) => {
  let user = req.body;

  try {
    const registrationResult = await auth.registerUser(user);

    if (registrationResult.error) {
      res.status(400).json({ error: registrationResult.error });
    } else {
      res.status(201).json({ userId: registrationResult.userId });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/app/reservation", async (req, res) => {
  try {
    const db = await dbConnect();

    const reservationsCollection = db.collection("Reservations");
    // Extract iz bodija
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
