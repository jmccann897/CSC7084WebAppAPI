const express = require('express');
const controller = require('../controllers/usercontroller');

const router = express.Router();

router.get('', controller.g)