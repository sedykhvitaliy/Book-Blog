const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require("path");
const session = require('express-session');
const usersController = require('./controllers/users.js');
const authController = require('./controllers/auth.js');
const booksController = require('./controllers/books.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const User = require('./models/user.js');
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/favicon.ico', (req, res) => res.send(''));  //https://stackoverflow.com/questions/43016478/casterror-cast-to-objectid-failed-for-value-favicon-ico-at-path-id-for-mod  last answer

app.get('/home', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/userhome', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
    res.render('users/user.ejs',{
        user: currentUser,
    });
});



app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/', usersController);
app.use('/users/:userId/books',booksController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});