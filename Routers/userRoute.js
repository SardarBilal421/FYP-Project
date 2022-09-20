const express = require('express');
const authController = require('./../Controller/authController');
const userContrller = require('./../Controller/userController');

const router = express.Router();

router.get('/login', authController.logInUser);
router.route('/signup').post(authController.signUp);

router
  .route('/:id')
  .get(authController.protect, userContrller.getUserById)
  .patch(userContrller.updateUser)
  .delete(userContrller.deleteUser);

module.exports = router;
