const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Schema.Types.ObjectId;

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  joined_at: Date,
  avatar_url: String,
  description: {
    type: String,
    minLength: 0,
    maxLength: 100
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  const query = {
    username: username
  };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getAll = (limit = 20, offset = 0, callback) => {
  User.find({}, null, { skip: offset, limit }, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
