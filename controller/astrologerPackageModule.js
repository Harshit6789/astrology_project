const astrologerpackageModel = require("../model/astrologerPackageModel");


exports.packageRegister = async (req, res) => {
    try {
        const { packageName, month, days, packageCost, astrologerType } = req.body;
        const isPackageExist = await astrologerpackageModel.findOne({ packageName: packageName });
        if (isPackageExist) {
            return res.status(400).json({ message: "This package is already exist in database" });
        }
        const packageData = new astrologerpackageModel({ packageName, month, days, packageCost, astrologerType })
        if (packageData) {
            const data = await packageData.save();
            return res.status(200).send({ message: data });
        }
        else {
            return res.status(400).json("message:" + err);
        }
    }
    catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

exports.getPremiumPackage = async (req, res) => {
    try {
        await astrologerpackageModel.find({ astrologerType: "Premium" }).exec(function (err, result) {
            if (err) {
                return res.json({ message: "Astrologer package data is not found" + err });
            } else {
                return res.json({ message: result });
            }
        })
    } catch (err) {
        return res.json({ message: "Astrologer package are not found, Please check the address" + err });
    }
}

exports.getNormalPackage = async (req, res) => {
    try {
        await astrologerpackageModel.find({ astrologerType: "Normal" }).exec(function (err, result) {
            if (err) {
                return res.json({ message: "Astrologer package data is not found" + err });
            } else {
                return res.json({ message: result });
            }
        })
    } catch (err) {
        return res.json({ message: "Astrologer package are not found, Please check the address" + err });
    }
}

exports.packageUpdate = async (req, res) => {
    try {
        await astrologerpackageModel.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                packageName: req.body.packageName,
                month: req.body.month,
                email: req.body.email,
                days: req.body.days,
                packageCost: req.body.packageCost,
                astrologerType: req.body.astrologerType,
            }
        }).exec(function (err, astrologerPackage) {
            if (!astrologerPackage) {
                return res.status(400).json({ message: "Data is not update, Please check the update function" + err });
            } else {
                return res.status(200).json({ message: "Your data is updated sucessfully" });
            }
        });
    } catch (err) {
        return res.status(400).json({ message: "Data is not update, Please check the save method" + err });
    }
}

exports.packageDelete = async (req, res) => {
    try {
        await astrologerpackageModel.deleteOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Astrologer package is not found" + err });
            }
            else {
                return res.status(200).json({ message: "Astrologer package is delete" });
            }
        })
    } catch (err) {
        return res.status(400).json({ message: "Astrologer package id is not found" + err });
    }
}

exports.getPackage = async (req, res) => {
    try {
        var name = req.body.packageName;
        await astrologerpackageModel.find({ packageName: new RegExp('^' + name + '$', "i") }, function (err, result) {
            if (err) {
                return res.json({ message: "Astrologer package is not found" });
            }
            else {
                return res.send(result);
            }
        });

    } catch (error) {
        return res.json({ message: "Astrologer package id is not found" });
    }
}