const express = require('express');
const validate = require('../validate');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const { register, logIn, forgotPassword, resetPassword, deleteUser } = require('../controller/adminPanel');
=======
const { register, logIn, forgotPassword, resetPassword  , joinAstrology} = require('../controller/adminPanel');
>>>>>>> 844b85f78af941ae0ad467b61af79d761edd8fb0
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

<<<<<<< HEAD
/*Delete User*/
router.post('/deleteUser/:id', deleteUser);

=======
//join astrology
router.post('/joinAstrology' , joinAstrology);
>>>>>>> 844b85f78af941ae0ad467b61af79d761edd8fb0
module.exports = router;