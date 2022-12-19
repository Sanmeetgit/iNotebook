const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// define the home page route
//Create a user using POST /api/auth/createuser ; Doesn't require Authentication(login)
router.post('/createuser',
    body('name', "Name is too short").isLength({ min: 2 }),
    body('email', "Email is not valid").isEmail(),
    body('password', "Password is too short").isLength({ min: 5 }),
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        // If there are errors then return a bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if a user with same email already exists
        // console.log(User.findOne({email: req.body.email}));
        try {

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "User with same email already exists!!" })
            }
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })

            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).json("Some Error occured");
        };
    })

module.exports = router