import express from "express";
import "dotenv/config";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("");
});

app.post("/register", (req, res) => {
  console.log("email:", req.body.email);
  console.log("password:", req.body.password);
  res.send("Uspjesno registriran korisnik");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
