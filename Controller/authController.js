const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');
const promisfy = require('promisfy');
const { exists } = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendEmail = require('./../utilities/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// JWT PROTECTION METHOD

exports.protect = catchAsync(async (req, res, next) => {
  //Gettingtokeen and chec of its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('User is not Logged in Please Log in!!!'));
  }
  // Verfiyingg tokeenn
  const decode = await promisfy(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user stikk exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new appError('user belong to this token doesnot exit', 401));
  }

  // check if user change password after logged in
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new appError('Please Logged in again', 401));
  }

  //GRAND ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
});

// USER SIGN UPPPP

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createSendToken(user, 201, res);
});

// USER LOG INNN

exports.logInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new appError('Please Provide Email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new appError('Input Email or Password in inCorrect', 401));
  }

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

// ACCESS RESTRICKTIONNN

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You Dont Have Permission yo access this Route', 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //get user based on Posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('THere is no user with such Emaill::', 404));
  }
  //Generate the radnom EMail reset Tokennn
  const userResetToken = user.createPasswordResetToken();
  console.log(userResetToken);
  await user.save({
    validateBeforeSave: false,
  });

  console.log('USERRR', user);

  //send it to user Email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${userResetToken}`;
  const message = ` forget your emial??? please send you passord and 
               confirmPassword with this emial::${resetURL}. \n 
               if you didnt forget Email Please igone this mail `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Resset Toekn Valid upto 10 Min',
      message,
    });
    res.status(200).json({
      status: 'successs',
      message: 'token sended to EMailll',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new appError('there is an error sending you EMAIL'), 500);
  }
});
