const mongoose = require('mongoose');
const validator = require('validator');
const bcyrpt = require('bcrypt');
const crypto = require('crypto');
const { rand } = require('elliptic');
const EC = require('elliptic').ec;
let ec;

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A User must have first name'],
  },
  lastName: {
    type: String,
    required: [true, 'A User must have last name'],
  },
  email: {
    type: String,
    require: [true, 'A User must have email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid Email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter a password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  cnic: {
    type: String,
    required: [true, 'Please enter a Cnic'],
    validate: {
      validator: function (v) {
        return /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(v);
      },
      message: 'Please enter a valid Cnic Number',
    },
  },
  address: {
    type: String,
    required: [true, 'Please enter a Address'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Please enter a Gender'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dob: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'lawyer'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    select: false,
    default: true,
  },
  privateKey: {
    type: String,
    default: function () {
      ec = new EC('secp256k1');
      return btoa(ec.genKeyPair().getPrivate('hex'));
    },
    unique: true,
  },
  publicKey: {
    type: String,
    unique: true,
  },
  verificationCode: {
    type: Number,
    default: 0,
  },
  photo: [String],
  cnicPhoto: [String],
  barAssociation: [String],
  billPhoto: [String],
  stamp: [String],
  passwordChangeAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
});

// this middleware Dont select the NON_ACTIVE users
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// encrypt PASSWORD before saveing to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcyrpt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function (next) {
//   console.log("waja")
  if (!this.isModified('privateKey')) return next();
// console.log("Waja2")
  this.publicKey = ec.keyFromPrivate(atob(this.privateKey)).getPublic('hex');
});

// method Check is password is matches the input password or not
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcyrpt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = (JWTTimeStamp) => {
  if (!this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('SHA256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.methods.createVerificationToken = function () {
  const random = Math.floor(Math.random() * 9000 + 1000);
  this.verificationCode = random;
  return random;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
