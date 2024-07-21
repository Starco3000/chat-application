const mongoose = require('mongoose');
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;
    connection.on('connect', () => {
      console.log('Database connected successfully');
    });

    connection.on('error', (error) => {
      console.log('Something is wrong in mongodb ', error);
    });
  } catch (error) {
    console.log('Something is wrong ', error);
  }
}


module.exports = connectDB;