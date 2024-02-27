import dbConnect from "./db.js";
import bcrypt from "bcrypt";

export default {
  async registerUser(userData) {
    let db = await dbConnect();

    let doc = {
      email: userData.email,
      password: await bcrypt.hash(userData.password, 8),
    };

    try {
      let result = await db.collection("users").insertOne(doc);
      if (result && result.insertedId) {
        return { userId: result.insertedId };
      }
    } catch (e) {
      if (e.name == "MongoServerError" && e.code == 11000) {
        const duplicateKey = Object.keys(e.keyValue)[0];
        return {
          error: `Korisnik s ovim ${duplicateKey}-om već postoji.`,
        };
      }
    }
  },
};
