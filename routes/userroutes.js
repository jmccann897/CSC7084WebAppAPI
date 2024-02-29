const express = require('express');
const controller = require('../controllers/usercontroller');

const router = express.Router();

router.get('/users/:id', controller.userdash);
router.get('/admin/:id', controller.admindash);
router.get('/datavis/:id', controller.datavis);

router.post('/signup', controller.postSignUp);
router.post('/users/signup', controller.postRegUser);
router.post('/usercheck', controller.postUserCheck);
router.post('/users/', controller.postLogin);

module.exports = router;
