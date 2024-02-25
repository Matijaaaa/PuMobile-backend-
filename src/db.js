import mongo from "mongodb";

let connection_string =
  "mongodb+srv://admin:Mustang60@cluster0.1spqxup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

export default () => {
  return new Promise((resolve, reject) => {
    if (db && client.isConnected()) {
      console.log("Using existing database connection");
      resolve(db);
    }

    client.connect((err) => {
      if (err) {
        console.error("Error connecting to MongoDB:", err);
        reject("Došlo je do greške prilikom spajanja: " + err);
      } else {
        console.log("Uspješno spajanja na bazu");
        db = client.db("PuMobile");
        resolve(db);
      }
    });
  });
};
