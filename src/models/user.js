const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// User mongoose schema.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid.');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive value.')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    trim: true,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain the word password.');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

/* CUSTOM MONGOOSE METHODS */

// Custom instance mongoose method.
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// custom instance method
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  // Remove certain fields from the object being sent back as a response.
  delete userObject.password;
  delete userObject.token;
  delete userObject.avatar;

  return userObject;
}

// Custom static mongoose method.
userSchema.statics.findByCredentials = async(email, password) => {
  // Find user by their email.
  const user = await User.findOne({ email });
  // If no matching user with provided email, throw error.
  if(!user) {
    throw new Error('Unable to login');
  }

  // check if entered password matches hashed password for the user.
  const isMatch = await bcrypt.compare(password, user.password);

  // If entered password does not match hashed password, throw an error.
  if(!isMatch) {
    throw new Error('Unable to login')
  }
  return user;
};

/* MONGOOSE MIDDLE FOR BEFORE SAVING USER */

// Hash the plain text password before saving.
userSchema.pre('save', async function(next) {
  // user being saved.
  const user = this;

  // Check if the user's password has been modified.
  if(user.isModified('password')) {
    // if yes: hash user password.
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// delete user tasks when user is removed.
userSchema.pre('remove', async function(next) {
  const user = this;
  // Delete all user tasks who's owner field matches the _id of the user being removed.
  await Task.deleteMany({ owner: user._id });
  next();
})


// Define User model.
const User = mongoose.model('User', userSchema);

module.exports = User;





// Make a new user instance.
// const me = new User({
//   name: ' Marius  ',
//   email: 'MYEMAIL@ME.COM  ',
//   password: 'strongOne'
// });

// save new user instance to db.
// me.save()
// .then(me => {
//   console.log(me);
// })
// .catch(error => {
//   console.log('Error:', error);
// });