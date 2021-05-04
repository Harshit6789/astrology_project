const express = require('express');
const validate = require('../validate');
const bodyParser = require('body-parser');
const { signup, signin, forgotPassword, resetPassword } = require('../controller/adminPanel');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*sending data*/
router.post('/register', validate, signup);

/*login user*/
router.post('/signin', signin);

router.put('/forgotPassword', forgotPassword);
router.put('/resetPassword', resetPassword);

module.exports = router;