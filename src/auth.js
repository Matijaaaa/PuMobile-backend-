import dbConnect from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  async authenticateUser(email, password) {
    let db = await dbConnect();
    let user = await db.collection("users").findOne({ email: email });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      delete user.password;
      let token = jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "1 week",
      });
      return {
        token,
        email: user.email,
      };
    } else {
      throw new Error("Cannot authenticate");
    }
  },
  verify(req, res, next) {
    try {
      let authorization = req.headers.authorization.split(" ");
      let type = authorization[0];
      let token = authorization[1];

      if (type !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        return next();
      }
    } catch (e) {
      return res.status(401).send();
    }
  },
};
