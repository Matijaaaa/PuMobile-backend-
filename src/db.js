import mongo from "mongodb";
import "dotenv/config";

let connection_string = process.env.MONGO;

let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

export default () => {
  return new Promise((resolve, reject) => {
    if (db && client && client.topology && client.topology.isConnected()) {
      console.log("Using existing database connection");
      resolve(db);
    } else {
      client.connect((err) => {
        if (err) {
          console.error("Error connecting to MongoDB:", err);
          reject("Došlo je do greške prilikom spajanja: " + err);
        } else {
          console.log("Uspješno spajanje na bazu");
          db = client.db("PuMobile");
          resolve(db);
        }
      });
    }
  });
};
