const {check} = require('express-validator')

module.exports = [
    check('aifname')
        .exists().withMessage('Please provide your first name')
        .notEmpty().withMessage('Empty first name is not allowed'),
    check('ailname')
        .exists().withMessage('Please provide your last name')
        .notEmpty().withMessage('Empty last name is not allowed'),
    check('aiemail')
        .exists().withMessage('Please provide your email address')
        .notEmpty().withMessage('Email is obligatory')
        .isEmail().withMessage('Invalid email address'),
    check('aiphone')
        .isLength({max: 11}).withMessage('Invalid phone number'),
]