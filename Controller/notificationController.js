const Notification = require('./../Models/notificationModel');
const appError = require('./../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const User = require('./../Models/userModel');
const sendTrans = require('../utilities/stripe');

exports.sendNotification = catchAsync(async (req, res, next) => {
  const user = await User.find({ publicKey: req.body.reciever });

  if (user.length <= 0) {
    return next(
      new appError(
        'The User you are trying to send noticiation does not Exist',
        404
      )
    );
  }

  const noti = await Notification.create(req.body);
  if (!noti) {
    return next(new appError('unable to send notification', 404));
  }

  res.status(201).json({
    status: 'success',
    message: 'Signature Request sended to user',
  });
});

exports.getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.find({ reciever: req.params.pk });

  if (!notification) {
    return next(new appError('this user has no Notifications', 404));
  }

  res.status(201).json({
    status: 'success',
    length: notification.length,
    data: {
      notification,
    },
  });
});

exports.transaction = catchAsync(async (req, res, next) => {
  const trans = await sendTrans();
  console.log(trans);

  res.status(201).json({
    status: 'success',
    Massage: 'Transaction Completed',
  });
});
