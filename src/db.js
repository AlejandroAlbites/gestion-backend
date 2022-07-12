const mongoose = require("mongoose");

let connection;

function connect() {
  if (connection) return;

  const uri = process.env.MONGODB_URI;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Connection with MongoDB established successfully");
  });
  connection.on("disconnected", () => console.log("Succesfully disconnected"));
  connection.on("error", (err) => console.log("Something went wrong", err));

  mongoose.connect(uri, options);
}

async function disconnected() {
  if (!connection) return;
  await mongoose.disconnect();
}

async function cleanup() {
  for (const collection in connection.collections) {
    await connection.collections[collection].deleteMany({});
  }
}

module.exports = { connect, disconnected, cleanup };
