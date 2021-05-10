const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const joinAstrology = require('../model/joinAstrology');

exports.register = async (req, res) => {
    try {
        const isEmail = await userModel.findOne({ email: req.body.email });
        if (isEmail) {
            return res.status(400).json({
                error: "This Email is already exists"
            });
        }
        let encryptedPassword = await bcrypt.hash(req.body.password, 8);
        const userData = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: encryptedPassword
        })
        if (userData) {
            const data = await userData.save();
            return res.status(200).json({ message: data })
        }
        else {
            res.json("Error:" + err);
        }
    }
    catch (err) {
        return res.status(400).json({ error: "something went wrong" + err })
    }
}

exports.logIn = async (req, res) => {
    const userDetail = await userModel.findOne({ email: req.body.email });
    if (!userDetail) {
        return res.status(400).json({
            error: "User not found, Please enter valid detail"
        });
    }
    const validPassword = await bcrypt.compare(req.body.password, userDetail.password);
    if (!validPassword) {
        return res.status(400).json({
            error: "Password is not correct, Please verify your password"
        })
    }
    else {
        if (userDetail.isadmin == true) {
            return res.status(200).json("Welcome to the admin dashboard");
        }
        else {
            return res.status(200).json("Welcome to the user dashboard");
        }
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    await userModel.findOne({ email }, async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with this email is not exist" });
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
            text: "Plaese click that button",
            html: `
            <h2>Please click on given link to reset your password</h2>
             <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
            `
        });
        return userModel.updateOne({ email: req.body.email }, { resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "Reset password Link Error" });
            }
            else {
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                return res.status(200).json({ message: info.messageId });
            }
        })
    })
}

exports.resetPassword = async (req, res) => {
    const { resetLink, newPass } = req.body;
    if (resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async (err, decodeData) => {
            if (err) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired" + err
                })
            }
            await userModel.findOne({ resetLink }, async (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: "User with this token does not exist" });
                }
                let encryptedPassword = await bcrypt.hash(newPass, 8);
                let object = {
                    password: encryptedPassword,
                    resetLink: ""
                }
                await userModel.updateOne({ resetLink: resetLink }, object, (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Reset Password Error" + err
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
        return res.status(401).json({ error: "Link is not found" });
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
            birthtimee: req.body.birthtime,
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

exports.deleteUser = async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                return res.status(400).json({
                    message: "User is not found" + err
                });
            }
            else {
                return res.status(200).json({
                    message: "User id Remove"
                });
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: "User id is not found" + err
        });
    }
}

//update user
exports.updateUser = async(req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        console.log(req.params.id);
        console.log(user);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        const u = await user.save();
        res.status(200).send(u)
    }catch(err){
        throw err;
    }
}