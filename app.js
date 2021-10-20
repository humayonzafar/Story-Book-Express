const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
//load config
dotenv.config({path:'./config/config.env'});
connectDB();
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`));