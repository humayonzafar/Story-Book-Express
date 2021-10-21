const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
//load config
dotenv.config({path: './config/config.env'});

const app = express();

//connect database
connectDB();

//logging if development server
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

//handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs');

//static folder
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/',require('./routes/index'));

const port = process.env.PORT || 3000;

app.listen(port,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`));