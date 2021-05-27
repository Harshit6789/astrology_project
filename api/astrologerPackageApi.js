const express = require('express');
const { packageRegister, packageUpdate, packageDelete, getSubscription, getPackage } = require('../controller/astrologerPackageModule');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/*Register the astrologer package by admin*/
router.post("/packageRegister", packageRegister);

/*Get Package subscription by astrolger*/
router.get("/getSubscription", getSubscription);

/*Update the astrologer package by admin*/
router.put("/packageUpdate/:id",packageUpdate);

/*Delete the astrologer package by admin*/
router.post("/packageDelete/:id",packageDelete);

/*Searching the astrologer package by admin*/
router.post("/getPackage",getPackage);

module.exports = router;