const express = require('express');
const validate = require('../userValidate');
const bodyParser = require('body-parser');
const { register, logIn, forgotPassword, resetPassword, deleteUser, joinAstrology, updateUser, sortUsers, listUsers, pagiUsers , getData, activateAndDeactivateUser, getUser} = require('../controller/userModule');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*Register the user by user*/
router.post('/register', validate, register);

/*Login the user by user*/
router.post('/logIn', logIn);

/*Forgot-password of user*/
router.put('/forgotPassword', forgotPassword);

/*Reset-password of user*/
router.put('/resetPassword', resetPassword);

//update user
router.patch('/updateUser/:id', updateUser);

/*Delete User by admin*/
router.post('/deleteUser/:id', deleteUser);

//sort users 
router.get('/sortUsers', sortUsers);

//listing users
router.get('/listUsers', listUsers);

//pagination of users
router.get('/pagiUsers/:pageNo?', pagiUsers);

/*Activate and deactivate user by admin*/
router.put('/activateAndDeactivateUser', activateAndDeactivateUser);

/*Get the data of user and show to the admin*/
router.get('/get', getData);

/*Search the user by admin*/
router.get('/getUser', getUser);

//join astrology
router.post('/joinAstrology', joinAstrology);

module.exports = router;












