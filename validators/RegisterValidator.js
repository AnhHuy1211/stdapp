const {check} = require('express-validator')

module.exports = [
    check('cfname')
        .exists().withMessage('Please provide your first name')
        .notEmpty().withMessage('Empty first name is not allowed'),
    check('clname')
        .exists().withMessage('Please provide your last name')
        .notEmpty().withMessage('Empty last name is not allowed'),
    check('cemail')
        .exists().withMessage('Please provide your email address')
        .notEmpty().withMessage('Email is obligatory')
        .isEmail().withMessage('Invalid email address'),
    check('cphone')
        .isLength({max: 11}).withMessage('Invalid phone number')
]