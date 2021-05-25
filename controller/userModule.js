const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/*Register the user by user*/
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userDetails = await userModel.findOne({ email });
        if (userDetails) {
            return res.status(400).json({ message: "This Email is already exists" });
        }
        let encryptedPassword = await bcrypt.hash(password, 8);
        const userData = new userModel({ firstName, lastName, email, password: encryptedPassword })
        if (userData) {
            const data = await userData.save();
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

/*Login the user by user*/
exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetail = await userModel.findOne({ email: email });
        if (!userDetail) {
            return res.status(400).json({ message: "User not found, Please enter valid email" });
        }
        const validPassword = await bcrypt.compare(password, userDetail.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Password is not correct, Please verify your password" })
        }
        else if (userDetail.isActive == false) {
            return res.status(400).json({ message: "User account is deactivate" });
        }
        else {
            if (userDetail.isAdmin == true) {
                const token = jwt.sign({ email: email }, process.env.ADMIN_TOKEN_KEY, { expiresIn: "20m" });
                return res.status(200).json({ message: "Welcome to the admin dashboard", token: token });
            }
            else{
                return res.status(400).json({ message: "Admin entries is not correct, Please check it again" + err });
            }
        }
    } catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

/*Forgot-password of user*/
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await userModel.findOne({ email }, async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ message: "User with this email is not exist" });
            }
            const token = jwt.sign({ email: req.body.email }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" });
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
             <a href="${process.env.CLIENT_URL}/resetpassword/${token}">Click Here to  reset the password</a>
            `
            });
            return userModel.updateOne({ email: req.body.email }, { resetLink: token }, function (err, success) {
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

/*Reset-password of user*/
exports.resetPassword = async (req, res) => {
    try {
        const { resetLink, newPass } = req.body;
        if (resetLink) {
            jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async (err, decodeData) => {
                if (err) {
                    return res.status(401).json({
                        message: "Incorrect token or it is expired" + err
                    })
                }
                await userModel.findOne({ resetLink }, async (err, user) => {
                    if (err || !user) {
                        return res.status(400).json({ message: "User with this token does not exist" });
                    }
                    let encryptedPassword = await bcrypt.hash(newPass, 8);
                    let object = {
                        password: encryptedPassword,
                        resetLink: ""
                    }
                    await userModel.updateOne({ resetLink: resetLink }, object, (err, result) => {
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
            return res.status(401).json({ message: "Link is not found" });
        }
    } catch (err) {
        return res.status(400).json({ message: "something went wrong" + err });
    }
}

//update user
exports.updateUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        const u = await user.save();
        res.status(200).send(u)
    } catch (err) {
        throw err;
    }
}

/*Delete user by admin*/
exports.deleteUser = async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "User is not found" + err });
            }
            else {
                return res.status(200).json({ message: "User id Remove" });
            }
        })
    } catch (err) {
        return res.status(400).json({ message: "User id is not found" + err });
    }
}


//sorting users on basis of names
exports.sortUsers = async (req, res) => {
    try {
        let sortedUsers = await userModel.find().collation({ locale: "en" }).sort({ firstName: 1 });
        res.status(200).send(sortedUsers);
    } catch (err) {
        throw err;
    }
}

//pagination of users
exports.pagiUsers = async (req, res) => {
    try {
        let pageNo = req.params.pageNo;
        let totalRows = await userModel.count();
        let totalPages = Math.ceil(totalRows / 5);
        let pagiUsers = await userModel
            .find()
            .limit(5)
            .skip((pageNo - 1) * 5);
        res.status(200).send({ totalPages: totalPages, Users: pagiUsers });
    } catch (err) {
        throw err;
    }
}

//listing of users 
exports.listUsers = async (req, res) => {
    try {
        let listUsers = await userModel.find().limit(5);
        res.status(200).send(listUsers);
    } catch (err) {
        throw err;
    }
}

/*Activate and deactivate all the user by admin*/
exports.activateAndDeactivateUser = async (req, res) => {
    try {
        const { email, isActive } = req.body;
        await userModel.findOne({ email }, async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ message: "User with this email is not exist" });
            }
            await userModel.updateOne({ email: email }, { isActive: isActive }, { new: true }, (err, result) => {
                if (err) {
                    return res.status(400).json({ message: "User account is not activate or deactivate" + err });
                } else {
                    console.log(result);
                    return res.status(200).send(result);
                }
            })
        })
    }
    catch (err) {
        return res.status(400).json({ message: "User is not found, please check the email" + err });
    }
}

/*Get all the data of user in admin panel*/
exports.getData = async (req, res) => {
    try {
        await userModel.find().exec(function (err, result) {
            if (err) {
                return res.json({ message: "User data is not found" + err });
            } else {
                return res.json({ message: result });
            }
        })
    } catch (err) {
        return res.json({ message: "Users are not found, Please check the address" + err });
    }
}

/*Search the user by admin*/
exports.getUser = async (req, res) => {
    try {
        var name = req.body.firstName;
        await userModel.find({ firstName: new RegExp('^' + name + '$', "i") }, function (err, result) {
            if (err) {
                return res.json({ message: "User is not found" });
            }
            else {
                return res.send(result);
            }
        });

    } catch (error) {
        return res.json({ message: "User Id is not found" });
    }
}

/*join astrology*/
exports.joinAstrology = async (req, res) => {
    try {
        const userData = new joinAstrology({
            billingperiod: req.body.billingperiod,
            fname: req.body.fname,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            birthtime: req.body.birthtime,
            birthlocation: req.body.birthlocation,
            email: req.body.email
        })

        try {
            const data = await userData.save();
            res.status(200).json({
                data: data
            })
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    }
}