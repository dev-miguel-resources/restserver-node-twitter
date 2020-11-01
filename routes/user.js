const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/user/list',
    auth,
    userController.listUser
);

router.get('/user/profile',
    auth,
    userController.readProfile
);

router.put('/user',
    auth,
    userController.updateUser
);

module.exports = router;