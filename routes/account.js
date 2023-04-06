const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const {validationResult} = require('express-validator');
const {registerValidators, loginValidators} = require('../utils/validators')

router.post('/reg', registerValidators, async (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    })
    try {
        await  User.addUser(newUser);
        res.json({
            success: true,
            msg: "User was added"
        })
        res.redirect('/')
    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            msg: "User wasn't added"
        })
    }
})

router.post('/auth', loginValidators, async(req, res) => {
    try {
        const {login, password} = req.body;
        const candidate = await User.findOne({login});
        console.log(candidate)
        const errors = validationResult(req);
        console.log('', errors)
        if(!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg);
            return res.status(400).redirect('/');
        }
        if (candidate) {
            const isExist = await bcrypt.compare(password, candidate.password);

            if (isExist) {//in candidate with finding login - the same password
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                   const token = jwt.sign({candidate}, config.secret, {
                        expiresIn: 3600 * 24
                    });
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: candidate._id,
                            name: candidate.name,
                            login: candidate.login,
                            email: candidate.email
                        }
                    });
                })
            } else {
                req.flash('loginError', 'Wrong password!')
                res.redirect('/account/auth/')//redirect into login page because wrong password
            }
        } else {
            req.flash('loginError', 'User doesnt exist')
            res.redirect('/account/auth/') //user with such email doesnt exist
        }
    } catch(err) {
        console.log(err)
    }
})

router.get('/reg', (req, res) => {
    res.send('Registration page')
})

router.get('/dashboard', passport.authenticate('jwt', {session: false}),(req, res) => {
    res.send('User account profile')
})

module.exports = router;
