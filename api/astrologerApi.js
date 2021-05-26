const express = require('express');
const validate = require('../astrologerValidation');
const { astrologerRegister, astrologerLogIn, forgotAstrologerPassword, resetAstrologerPassword, updateAstrologer, deleteAstrologer, sortAstrologers, listingAstrologers, paginationAstrologers, activateAndDeactivateAstrologer, getAstrologerData, getAstrologer } = require('../controller/astrologerModule');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/*Register the astrologer by astrologer*/
router.post('/astrologerRegister',validate, astrologerRegister);

/*Login the astrologer by astrologer*/
router.post('/astrologerLogIn', astrologerLogIn);

/*Forget the password of astrologer by astrologer*/
router.put('/forgotAstrologerPassword', forgotAstrologerPassword);

/*Reset the password of astrologer by astrologer*/
router.put('/resetAstrologerPassword', resetAstrologerPassword);

/*Update the astrologers by admin*/
router.put('/updateAstrologer/:id', updateAstrologer);

/*Delete the astrologers*/
router.post('/deleteAstrologer/:id', deleteAstrologer);

/*Sort the asrtrologers by admin*/
router.get('/sortAstrologers', sortAstrologers);

/*Listing the asrtrologers by admin*/
router.get('/listingAstrologers', listingAstrologers);

/*Pagination of asrtrologers*/
router.get('/paginationAstrologers/:pageNo?', paginationAstrologers);

/*Activate and deactivate all the user by admin*/
router.put('/activateAndDeactivateAstrologer', activateAndDeactivateAstrologer);

/*Get  the data of Astrologers and show in admin panel*/
router.get('/getAstrologerData', getAstrologerData);

/*Searching of astrologers by admin*/
router.post('/getAstrologer', getAstrologer);

module.exports = router;












