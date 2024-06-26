import "dotenv/config";
import express, { response } from "express";
import dbConnect from "./db.js";
import cors from "cors";
import auth from "./auth.js";

const app = express(); // instanciranje aplikacije
const port = process.env.PORT; // port na kojem će web server slušati

const corsOptions = {
  origin: "https://pumobile-frontend.onrender.com",
};
app.use(cors(corsOptions));
app.use(express.json()); //dekodira json poruke

app.get("/", (req, res) => {
  res.send("Welcome to PuMobile API");
});

app.get("/tajna", [auth.verify], (req, res) => {
  res.json({ message: "Ovo je tajna " + req.jwt.email });
});

app.post("/auth", async (req, res) => {
  let user = req.body;
  try {
    let result = await auth.authenticateUser(user.email, user.password);
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
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

app.post("/app/reservation", [auth.verify], async (req, res) => {
  try {
    const db = await dbConnect();

    const reservationsCollection = db.collection("Reservations");

    console.log("Request Body:", req.body);

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
      Price,
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
      Price,
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
