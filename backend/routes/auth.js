const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// define the home page route
//Create a user using POST /api/auth ; Doesn't require Authentication
router.post('/',
    body('name',"Name is too short").isLength({ min: 2 }),
    body('email',"Email is not valid").isEmail(),
    body('password', "Password is too short").isLength({ min: 5 }),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(user => res.json(user)).catch(err=>{
            console.log(err);
            res.json({"error":"Email is already used, please use different email"});
        }
        );
    })

module.exports = router