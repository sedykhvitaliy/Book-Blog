const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require("path");
const session = require('express-session');
const booksRouter = require('./controllers/books');
const usersController = require('./controllers/users.js');
const authController = require('./controllers/auth.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const User = require('./models/user.js');
app.use(express.static(path.join(__dirname, 'public')));



const port = process.env.PORT ? process.env.PORT : '4000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(passUserToView);

app.get('/', (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    // Redirect logged-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/books`);
  } else {
    // Show the homepage for users who are not logged in
    res.render('index.ejs');
  }
});

// app.get('/books', async (req, res) => {
//   const currentUser = await User.findById(req.session.user._id);
//   res.render('books/index.ejs', {
//     books: currentUser.books,
//     user: currentUser,
//   });
// });

app.get('/favicon.ico', (req, res) => res.status(204).end());





app.use('/auth', authController);
app.use(isSignedIn);
app.use('/', usersController);
app.use('/users/:userId/books', booksRouter);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});


