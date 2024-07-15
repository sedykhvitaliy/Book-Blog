const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descriptions: {
    type: String,

  },
  year: {
    type: String,
    
  },

  author: {
    type: String,

  }
})



const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  books: { type: [bookSchema], default: [] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;