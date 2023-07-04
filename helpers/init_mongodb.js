const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://litkumarsatwik2017:2aSNkAUMAuNRq7Rp@cluster0.wgskbgm.mongodb.net",
    {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Mongodb Connect");
  })
  .catch((error) => console.log(error));

mongoose.connection.on("connected", () => {
  console.log("mongoose Connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is Disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
