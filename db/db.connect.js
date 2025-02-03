const mongoose = require("mongoose");

// Access your MongoDB connection string from secrets

const mongoURI = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("Connected Successfully");
    }
  } catch (error) {
    console.error("Connection Failed", error);
  }
};

module.exports = { initializeDatabase };
