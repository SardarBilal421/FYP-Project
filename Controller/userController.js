const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');

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

exports.uploadPdf = uploaded.array('stamp');

exports.resizePdf = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.stamp = [];
  const filename = `user-stampPdf-${req.params.id}-${Date.now()}-${1}.pdf`;
  const pdfButtfer = Buffer.from(req.files[0].buffer);
  fs.writeFileSync(`public/pdf/${filename}`, pdfButtfer);

  const user = await User.findById(req.params.id);
  req.body.stamp.push(filename, ...user.stamp);
  console.log(req.body.stamp);

  next();
});

exports.getAll = catchAsync(async (req, res, next) => {
  const user = await User.find();

  if (!user) {
    return next(new appError('no record found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
