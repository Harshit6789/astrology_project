const express = require('express');
const { packageRegister, packageUpdate, packageDelete, getPremiumPackage,getNormalPackage, getPackage } = require('../controller/astrologerPackageModule');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/packageRegister", packageRegister);

router.get("/getPremiumPackage", getPremiumPackage);

router.get("/getNormalPackage", getNormalPackage);

router.put("/packageUpdate/:id",packageUpdate);

router.post("/packageDelete/:id",packageDelete);

router.post("/getPackage",getPackage);
module.exports = router;