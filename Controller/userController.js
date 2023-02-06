const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');

const sharp = require('sharp');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `doctor-${req.params.id}-${Date.now()}.jpeg`);
  },
});

// const upload = multer({ storage: storage });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image please uplaod an Image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPicDir = upload.array('photo');
exports.uploadCnicPicDir = upload.array('cnicPhoto');
exports.uploadBillPicDir = upload.array('billPhoto');
exports.uploadBarAssPicDir = upload.array('barAssociation');

exports.resizePicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.photo = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-photo-${req.params.id}-${Date.now()}-${
        1 + i
      }.jpeg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${filename}`);
      req.body.photo.push(filename);
    })
  );
  next();
});
exports.resizeCnicPicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.cnicPhoto = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-Cnic-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${filename}`);
      req.body.cnicPhoto.push(filename);
    })
  );
  next();
});
exports.resizeBillPicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.billPhoto = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-Bill-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${filename}`);
      req.body.billPhoto.push(filename);
    })
  );
  next();
});
exports.resizeBarPicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.barAssociation = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-BarAssociation-${req.params.id}-${Date.now()}-${
        1 + i
      }.jpeg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${filename}`);
      req.body.barAssociation.push(filename);
    })
  );
  next();
});

exports.uploaded = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) next(new appError('Unable to upload Photo', 404));

  res.status(201).json({
    status: 'success',
    massage: 'Picture Uploaded',
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false });

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    massage: 'User is Deleted',
  });
});
