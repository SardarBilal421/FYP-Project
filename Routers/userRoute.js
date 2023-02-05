const express = require('express');
const authController = require('./../Controller/authController');
const userContrller = require('./../Controller/userController');

const router = express.Router();

router.post('/forgetPassword', authController.forgetPassword);

router.get('/login', authController.logInUser);
router.route('/signup').post(authController.signUp);
router.use(authController.protect);
router
  .route('/:id')
  .get(userContrller.getUserById)
  .patch(userContrller.updateUser)
  .delete(userContrller.deleteUser);

module.exports = router;
