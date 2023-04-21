const express = require('express');
const cors = require('cors');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const accountRoutes = require('./routes/account')

const app = express();

const port = process.env.PORT || 3001;
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport);

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db);

mongoose.connection.on('connected', () => {
    console.log('Successful connect')
})

mongoose.connection.on('error', (err) => {
    console.log('Failed connection!')
})

app.get('/', (req, res) => {
    res.send(JSON.stringify('Hello MEAN app! It is main page'));
})

app.use('/account', accountRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(port, () => {
    console.log("Server was started by port " + port + "...")
})


