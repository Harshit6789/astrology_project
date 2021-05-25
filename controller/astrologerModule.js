const astrologerModel = require("../model/astrologerModel");
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/*Register the astrologer by astrologer*/
exports.astrologerRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password, experience, specialisation } = req.body;
        const isEmail = await astrologerModel.findOne({ email });
        if (isEmail) {
            return res.status(400).json({ message: "This Email is already exists" });
        }
        let encryptedPassword = await bcrypt.hash(password, 8);
        const astroData = new astrologerModel({ firstName, lastName, email, password: encryptedPassword, experience, specialisation })
        if (astroData) {
            const data = await astroData.save();
            return res.status(200).send({ message: data })
        }
        else {
            return res.status(400).json("message:" + err);
        }
    }
    catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

/*Login the astrologer by astrologer*/
exports.astrologerLogIn = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        var roles = role;
        if (roles === "user") {
            const userData = await userModel.findOne({ email: email });
            console.log(userData);
            if (!userData) {
                return res.status(400).json({ message: "User not found, Please enter valid email" });
            }
            const validPassword = await bcrypt.compare(password, userData.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Password is not correct, Please verify your password" })
            }
            else if (userData.isActive == false) {
                return res.status(400).json({ message: "User account is deactivate" });
            }
            else {
                const token = jwt.sign({ email: email }, process.env.USER_TOKEN_KEY, { expiresIn: "20m" });
                return res.status(200).json({ message: "Welcome to the user dashboard", token: token });

            }
        }
        else if (roles === "astrologer") {
            const astroDetail = await astrologerModel.findOne({ email: email });
            if (!astroDetail) {
                return res.status(400).json({ message: "User not found, Please enter valid email" });
            }
            const validPassword = await bcrypt.compare(password, astroDetail.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Password is not correct, Please verify your password" })
            }
            else if (astroDetail.isActive == false) {
                return res.status(400).json({ message: "User account is deactivate" });
            }
            else {
                const token = jwt.sign({ email: email }, process.env.USER_TOKEN_KEY, { expiresIn: "20m" });
                return res.status(200).json({ message: "Welcome to the Astrologer dashboard", token: token });
            }
        }
        else {
            return res.status(400).json({ message: "All field are required in login,Please choose the role first" });
        }
    }
    catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

/*Forget the password of astrologer by astrologer*/
exports.forgotAstrologerPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await astrologerModel.findOne({ email }, async (err, astrologer) => {
            if (err || !astrologer) {
                return res.status(400).json({ message: "Astrologer with this email is not exist" });
            }
            const token = jwt.sign({ email: req.body.email }, process.env.RESET_ASTROLOGER_PASSWORD_KEY, { expiresIn: "20m" });
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_LOGIN,
                    pass: process.env.EMAIL_PASSWORD
                },
            });
            let info = await transporter.sendMail({
                from: 'noreply@hellogmail.com',
                to: email,
                subject: "Reset Your Password",
                html: `
            <h2>Please click on given link to reset your password</h2>
             <a href="${process.env.CLIENT_URL}/resetAstrologerpassword/${token}">Click Here to  reset the password</a>
            `
            });
            return astrologerModel.updateOne({ email: email }, { astroResetLink: token }, function (err, success) {
                if (err) {
                    return res.status(400).json({ message: "Reset password Link Error" });
                }
                else {
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    return res.status(200).json({ message: info.messageId });
                }
            })
        })
    } catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

/*Reset the password of astrologer by astrologer*/
exports.resetAstrologerPassword = async (req, res) => {
    try {
        const { astroResetLink, newPassword } = req.body;
        if (astroResetLink) {
            jwt.verify(astroResetLink, process.env.RESET_ASTROLOGER_PASSWORD_KEY, async (err, decodeData) => {
                if (err) {
                    return res.status(401).json({
                        message: "Incorrect token or it is expired" + err
                    })
                }
                await astrologerModel.findOne({ astroResetLink }, async (err, user) => {
                    if (err || !user) {
                        return res.status(400).json({ message: "User with this token does not exist" });
                    }
                    let encryptedPassword = await bcrypt.hash(newPassword, 8);
                    let object = {
                        password: encryptedPassword,
                        resetLink: ""
                    }
                    await astrologerModel.updateOne({ astroResetLink: astroResetLink }, object, (err, result) => {
                        if (err) {
                            return res.status(400).json({
                                message: "Reset Password Error" + err
                            });
                        }
                        else {
                            return res.status(200).json({ message: "Your password has been changed" });
                        }
                    })
                })
            })
        }
        else {
            return res.status(401).json({ message: "Input Link is not found in db" });
        }
    } catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

/*Update the astrologer by admin*/
exports.updateAstrologer = async (req, res) => {
    try {
        await astrologerModel.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                experience: req.body.experience,
                specialisation: req.body.specialisation
            }
        }).exec(function (err, astrologer) {
            if (!astrologer) {
                return res.status(400).json({ message: "Data is not update, Please check the update function" + err });
            } else {
                return res.status(200).json({ message: "Your data is updated sucessfully" });
            }
        });
    } catch (err) {
        return res.status(400).json({ message: "Data is not update, Please check the save method" + err });
    }
}


/*Delete the astrologer by admin*/
exports.deleteAstrologer = async (req, res) => {
    try {
        await astrologerModel.deleteOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Astrologer is not found" + err });
            }
            else {
                return res.status(200).json({ message: "Astrologer id Remove" });
            }
        })
    } catch (err) {
        return res.status(400).json({ message: "Astrologer id is not found" + err });
    }
}

/*Sorting astrologers on the basis of names*/
exports.sortAstrologers = async (req, res) => {
    try {
        let sortedUsers = await astrologerModel.find().collation({ locale: "en" }).sort({ firstName: 1 });
        return res.status(200).send(sortedUsers);
    } catch (err) {
        return res.status(400).json({ message: "Data is not found, Please check the db connecction" + err });
    }
}

/*Pagination of astrologers in admin Panel*/
exports.paginationAstrologers = async (req, res) => {
    try {
        let pageNo = req.params.pageNo;
        let totalRows = await astrologerModel.countDocuments();
        let totalPages = Math.ceil(totalRows / 5);
        let astrologerPagination = await astrologerModel.find().limit(5).skip((pageNo - 1) * 5);
        return res.status(200).send({ totalPages: totalPages, Users: astrologerPagination });
    } catch (err) {
        return res.status(400).json({ message: "Page is not found, Please check the Url" + err });
    }
}

/*Listing of astrologers by admin*/
exports.listingAstrologers = async (req, res) => {
    try {
        let astrologerList = await astrologerModel.find().limit(5);
        return res.status(200).send(astrologerList);
    } catch (err) {
        return res.status(400).json({ message: "Data is not accesss, Please check the db connection" + err });
    }
}

/*Activate and deactivate all the user by admin*/
exports.activateAndDeactivateAstrologer = async (req, res) => {
    try {
        const { email, isActive } = req.body;
        await astrologerModel.findOne({ email }, async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ message: "Astrologer with this email is not exist" });
            }
            await astrologerModel.updateOne({ email: email }, { isActive: isActive }, { new: true }, (err, result) => {
                if (err) {
                    return res.status(400).json({ message: "Astrologer account is not activate or deactivate" + err });
                } else {
                    return res.status(200).json({message:"In your account your request is updated"});
                }
            })
        })
    }
    catch (err) {
        return res.status(400).json({ message: "Astrologer is not found, please check the email" + err });
    }
}

/*Get  the data of Astrologers and show in admin panel*/
exports.getAstrologerData = async (req, res) => {
    try {
        await astrologerModel.find().exec(function (err, result) {
            if (err) {
                return res.json({ message: "Astrologer data is not found" + err });
            } else {
                return res.json({ message: result });
            }
        })
    } catch (err) {
        return res.json({ message: "Astrologers are not found, Please check the address" + err });
    }
}

/*Searching of astrologers by admin*/
exports.getAstrologer = async (req, res) => {
    try {
        var name = req.body.firstName;
        await astrologerModel.find({ firstName: new RegExp('^' + name + '$', "i") }, function (err, result) {
            if (err) {
                return res.json({ message: "Astrologer is not found" });
            }
            else {
                return res.send(result);
            }
        });

    } catch (error) {
        return res.json({ message: "Astrologer Id is not found" });
    }
}