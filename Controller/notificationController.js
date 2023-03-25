const Notification = require('./../Models/notificationModel');
const appError = require('./../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const User = require('./../Models/userModel');

exports.sendNotification = catchAsync(async (req, res, next) => {
  const user = User.find({ publicKey: req.body.reciver });

  if (!user) {
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
  const notifiation = await Notification.find({ reciver: req.params.pk });

  if (!notifiation) {
    return next(new appError('this user has no Notifications', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      notifiation,
    },
  });
});
