const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox11be7bb15add4393ae2f9831e2ba7efc.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

exports.signup = async (req, res) => {
    try {
        const isEmail = await userModel.findOne({ email: req.body.email });
        if (isEmail) {
            return res.status(400).send({
                error: "Email already exists"
            });
        }
        Password = await bcrypt.hash(req.body.password, 8);

        const user = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: Password,
            isadmin: req.body.isadmin
        })
        if (user) {
            const data = await user.save();
            return res.status(200).send({
                message: data
            })
        } else {
            res.send("Error: " + err);
        }
    } catch (err) {
        return res.status(400).send({
            error: "something went wrong" + err
        })
    }
}

exports.signin = async (req, res) => {
    const Email = await userModel.findOne({ email: req.body.email });
    if (!Email) {
        return res.status(400).send({
            error: "invalid email!!!!!!!"
        });
    }
    const validPass = await bcrypt.compare(req.body.password, Email.password);
    if (!validPass) {
        return res.status(400).send({
            error: "invalid password!!!!!!!"
        })
    }
    else {
        if (Email.isadmin == true) {
            return res.status(200).send("Welcome to the admin dashboard");
        }
        else {
            return res.status(200).send("Welcome to user dashboard");
        }
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    await userModel.findOne({ email }, async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with this email is not exist" });
        }
        const token = jwt.sign({ _id: userModel._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" });
        const data = {
            from: 'noreply@hellogmail.com',
            to: email,
            subject: 'Account Activation Link',
            html: `
        <h2>Please click on given link to reset your password</h2>
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
        `
        };
        return userModel.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "reset password link error" });
            }
            else {
                mg.messages().send(data, function (err, body) {
                    if (err) {
                        return res.json({
                            error: err.message
                        })
                    }
                    return res.json({ message: "Email haas been sent, kindly follow the instruction" });
                });
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
                    error: "Incorrect token or it is expired"
                })
            }
            await userModel.findOne({ resetLink }, async (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: "User with this token does not exist" });
                }
                Password = await bcrypt.hash(req.body.newPass, 8);
                const obj = {
                    password: Password,
                }

                userModel = _.extend(userModel, obj);
                userModel.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: "reset password error"
                        });
                    }
                    else {
                        return res.status(200).json({ message: "Your password has been changed" });
                    }
                })
            })
        })
    } else {
        return res.status(401).json({ error: "Authentication error!!!" });
    }
}