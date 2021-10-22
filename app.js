const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
//load config
dotenv.config({path: './config/config.env'});

const app = express();

//connect database
connectDB();

//passport config
require('./config/passport')(passport);

//logging if development server
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

//handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs');

//express session middleware
app.use(session({
    secret: 'humayon story',
    resave: false,
    saveUninitialized: false,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));

const port = process.env.PORT || 3000;

app.listen(port,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`));
