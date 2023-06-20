const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
          })
        console.log(`Conneted To DataBase ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}

module.exports = connectDB;