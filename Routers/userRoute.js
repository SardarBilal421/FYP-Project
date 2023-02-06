const express = require('express');
const authController = require('./../Controller/authController');
const userContrller = require('./../Controller/userController');

const router = express.Router();

router.post(
  '/uploadUserPhoto/:id',
  userContrller.uploadUserPicDir,
  userContrller.resizePicture,
  userContrller.uploaded
);
router.post(
  '/uploadCnic/:id',
  userContrller.uploadCnicPicDir,
  userContrller.resizeCnicPicture,
  userContrller.uploaded
);
router.post(
  '/uploadBill/:id',
  userContrller.uploadBillPicDir,
  userContrller.resizeBillPicture,
  userContrller.uploaded
);
router.post(
  '/uploadBarAss/:id',
  userContrller.uploadBarAssPicDir,
  userContrller.resizeBarPicture,
  userContrller.uploaded
);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/login', authController.logInUser);
router.route('/signup').post(authController.signUp);

// router.use(authController.protect);
router
  .route('/:id')
  .get(userContrller.getUserById)
  .patch(userContrller.updateUser)
  .delete(userContrller.deleteUser);

module.exports = router;
