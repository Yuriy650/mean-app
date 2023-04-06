const {body} = require('express-validator');

exports.loginValidators = [
    body('login')
        .trim(),
    body('password', 'Min passwords length 6 chars')
        .isLength({min: 5, max: 56})
        .isAlphanumeric()
        .trim()
];

exports.registerValidators = [
    body('email')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Min passwords length 6 chars')
        .isLength({min: 5, max: 56})
        .isAlphanumeric()
        .trim(),
    body('login')
        .trim(),
    body('name')
        .trim()
];
