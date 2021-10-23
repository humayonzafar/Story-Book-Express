const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
//load config
dotenv.config({path: './config/config.env'});

const app = express();

//body parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// method override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

//connect database
connectDB();

//passport config
require('./config/passport')(passport);

//logging if development server
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

//handlebars helpers
const {formatDate,truncate,stripTags,editIcon,select} = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs({
    helpers: {formatDate,truncate,stripTags,editIcon,select},
    defaultLayout: 'main', extname: '.hbs'}));

app.set('view engine', '.hbs');

//express session middleware
app.use(session({
    secret: 'humayon story',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variable
app.use(function (req,res,next){
    res.locals.user = req.user || null;
    next();
});
//static folder
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));

const port = process.env.PORT || 3000;

app.listen(port,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`));
