const express = require('express');
const notificationController = require('./../Controller/notificationController');

const router = express.Router();

router.post('/', notificationController.sendNotification);

router.get('/:pk', notificationController.getNotification);
router.delete('/:id', notificationController.deleteNotification);
// // router.use(authController.protect);

router.post('/trans', notificationController.transaction);

// router.route('/:pk').get(notificationController.getNotification);
//   .patch(userContrller.updateUser)
//   .delete(userContrller.deleteUser);

module.exports = router;
