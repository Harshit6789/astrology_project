const express = require('express');
const validate = require('../validate');
const bodyParser = require('body-parser');
const { register, logIn, forgotPassword, resetPassword, deleteUser, joinAstrology, updateUser, sortUsers, listUsers, pagiUsers , getData, activateAndDeactivateUser, getUser} = require('../controller/adminPanel');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*sending data*/
router.post('/register', validate, register);

/*login user*/
router.post('/logIn', logIn);

/*Get the data in ui*/
router.get('/get', getData);

/*Forgot-password*/
router.put('/forgotPassword', forgotPassword);

/*Reset-password*/
router.put('/resetPassword', resetPassword);

/*Delete User*/
router.post('/deleteUser/:id', deleteUser);

//join astrology
router.post('/joinAstrology', joinAstrology);

// Activate and deactivate user by admin
router.put('/activateAndDeactivateUser', activateAndDeactivateUser);


//update user
router.patch('/updateUser/:id', updateUser);

//sort users 
router.get('/sortUsers', sortUsers);


//listing users
router.get('/listUsers', listUsers);

//pagination of users
router.get('/pagiUsers/:pageNo?', pagiUsers);

/*Get the user data*/
router.get('/getUser/:id', getUser);

module.exports = router;