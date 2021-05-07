const express = require('express');
const validate = require('../validate');
const bodyParser = require('body-parser');
const { register, logIn, forgotPassword, resetPassword, deleteUser, joinAstrology } = require('../controller/adminPanel');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*sending data*/
router.post('/register', validate, register);

/*login user*/
router.post('/logIn', logIn);

/*Forgot-password*/
router.put('/forgotPassword', forgotPassword);

/*Reset-password*/
router.put('/resetPassword', resetPassword);

/*Delete User*/
router.post('/deleteUser/:id', deleteUser);

//join astrology
router.post('/joinAstrology', joinAstrology);
module.exports = router;