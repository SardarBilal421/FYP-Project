const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');
const sendTrans = require('../utilities/stripe');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const sendEmail = require('./../utilities/email');

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

const multerStorages = multer.memoryStorage();

const multerFilters = (req, file, cb) => {
  if (file.mimetype.includes('pdf')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image please uplaod an Image', 400), false);
  }
};

const uploaded = multer({
  storage: multerStorages,
  fileFilter: multerFilters,
});

exports.uploadUserPicDir = upload.array('photo');
exports.uploadCnicPicDir = upload.array('cnicPhoto');
exports.uploadBillPicDir = upload.array('billPhoto');
exports.uploadBarAssPicDir = upload.array('barAssociation');
exports.uploadPdf = uploaded.array('stamp');

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
        .toFile(`./public/img/${filename}`);
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
        .toFile(`./public/img/${filename}`);
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
        .toFile(`./public/img/${filename}`);
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
        .toFile(`./public/img/${filename}`);
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

  if (!user) next(new appError('Unable to upload', 404));

  res.status(201).json({
    status: 'success',
    massage: 'Uploaded',
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

exports.getUserByPk = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ publicKey: req.params.pk });

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

exports.resizePdf = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.stamp = [];
  const filename = `user-stampPdf-${req.params.id}-${Date.now()}-${1}.pdf`;
  const pdfButtfer = Buffer.from(req.files[0].buffer);

  let obj = { buffer: pdfButtfer };
  obj = JSON.parse(JSON.stringify(obj));

  // { type: 'Buffer',
  //   data: [ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100 ] }
  obj.buffer;

  // To convert from JSON representation back to a buffer, use `Buffer.from()`
  obj.buffer = Buffer.from(obj.buffer);

  // console.log('TEXT::', obj.buffer.toString('base64'));

  // fs.writeFileSync(
  //   `./public/pdf/${filename}`,
  //   pdfButtfer
  // );

  fs.writeFileSync(`./public/pdf/${filename}`, pdfButtfer);

  const user = await User.findById(req.params.id);
  req.body.stamp.push(filename, ...user.stamp);

  next();
});

exports.getAll = catchAsync(async (req, res, next) => {
  const user = await User.find();

  if (!user) {
    return next(new appError('no record found', 404));
  }
  res.status(200).json({
    status: 'success',
    length: user.length,
    data: {
      user,
    },
  });
});

exports.sendTrans = catchAsync(async (req, res, next) => {
  try {
    await sendTrans();

    res.status(200).json({
      status: 'success',
      message: 'Payment sended success fully',
    });
  } catch (err) {
    console.log(err);
  }
});

exports.sendAuthEmail = catchAsync(async (req, res, next) => {
  const message = `Please open the given link and compelete
   Required steps for verficiation. \n http://localhost:3000/mediarecorder \n <h1> 
   Here is you Stamp Click this link</h1>\n http://localhost:3000/viewStamp/${req.body.id} `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Authentication Email',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Code sended to Email',
    });
  } catch (err) {
    return next(new appError('there is an error sending you EMAIL'), 500);
  }
});
