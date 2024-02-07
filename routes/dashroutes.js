const express = require("express");
const controller = require('../controllers/dashcontroller');

const router = express.Router();

router.get('/dash', controller.getDash);
router.get('/edit/:id', controller.getEdit);

router.post('/addsnap', controller.postAddsnap);

router.put('/edit/:id', controller.postEdit);

router.delete('/del/:id', controller.postDelete);

module.exports = router;
