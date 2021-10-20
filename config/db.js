const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log(`Mongo Db Connected${conn.connection.host}`);
    } catch (e) {
       console.log('Mongo Db not connected ', e);
       process.exit(1);
    }
};

module.exports = connectDB;