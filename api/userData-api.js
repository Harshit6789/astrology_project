const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const validate = require('../validate');
const bodyParser = require('body-parser');

// const auth = require("../auth/AuthController");
// const secret = process.env.secret;
// const jwt = require('jsonwebtoken');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
/*sending data*/
router.post('/register', validate, async function (req, res) {
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
});

/*login user*/
router.post('/login', async (req, res) => {
   
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
    else{
        if (Email.isadmin == true) {
            return res.status(200).send("Welcome to the admin dashboard");
        }
        else{
            return res.status(200).send("Welcome to user dashboard");
        }
    }

    //else {
    //     jwt.sign(req.body, secret, { expiresIn: '1000s' }, (err, token) => {
    //         res.send({
    //             id: Email.id,
    //             Token: token
    //         })
    //     })
    // }

});

router.get('/home', async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).send({
            data: {
                message: user
            }
        });
    } catch (err) {
        res.send("Error " + err);
    }
});


/****authorizing users **/
router.post("/dashboard", (req, res) => {
    res.send("Welcome to the dashboard");
})

module.exports = router;