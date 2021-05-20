const express = require('express')
const passport = require('passport');
const mongoose = require('mongoose');
const Router = express.Router()
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
require('../config/passport')(passport);

const registerValidator = require('../validators/RegisterValidator')
const updateValidator = require('../validators/UpdateValidator')

const User = require('../models/AccountModel')
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    if(req.user || req.session.User) {
        return res.redirect('../')
    }
    else {
        next();
    }
}


Router.get('/login',isLoggedIn,(req, res)=>{
    return res.render('login', {code: 0, message: ''})
})

Router.post('/login', (req, res) =>{
    let {lemail, lpass} = req.body
    User.findOne({'email': lemail}).then((user) =>{
        if (!user) {
            return res.render('login', {code: 1, message: "Email not existed"})
        }
        req.session.User = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            class: user.google.class,
            departments: user.departments,
            phone: user.local.phone_number,
            dateob: user.local.birthday,
            role: user.role
        }
        return bcrypt.compare(lpass, user.local.password)
    }).then((match)=> {
        if(!match) {
            return res.render('login', {code: 1, message: "Wrong password"})
        }

        return res.redirect('./info')
    })
})

Router.get('/register', (req, res)=> {
    return res.render('createAcc', {code: 0, message: ''})
})
Router.post('/register', registerValidator,(req, res) =>{
    let result = validationResult(req)
    if(result.errors.length === 0) {
        let {cfname, clname, cemail, cdepartments, cphone, cdateob, crole, cpass} = req.body;
        User.findOne({'email': cemail}, (err, user) =>{
            if(err)
                throw err;
            else if(user)
                return res.render('createAcc', {code: 1, message: 'Email is already existed'})
            else {

                bcrypt.hash(cpass, 10, (err, hash) => {
                    let newUser = new User({
                        local: {
                            password: hash,
                            phone_number: cphone,
                            birthday: cdateob,
                        },
                        google: {
                            id: "",
                            token: "",
                            class: ""
                        },
                        first_name: cfname,
                        last_name: clname,
                        email: cemail,
                        departments: cdepartments,
                        role: crole
                    });
                    newUser.save((err)=>{
                        if(err) {
                            throw err;
                        }
                        return res.render('createAcc', {code: 0, message: 'Successfully create account!'})
                    });
                })
            }
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (let m in messages) {
            message = messages[m]
            break
        }
        return res.render('createAcc', {code: 1, message:message})
    }
})

Router.get('/info', (req, res) =>{
    return res.render('accInfo', {info: req.session.User})
})

Router.post('/info', updateValidator, (req, res) =>{
    let {aifname, ailname, aiemail, aiclass,
        alidepartments, aiphone, aidateob, aipass, aicpass} = req.body
    let result = validationResult(req)
    if(result.errors.length === 0){
        console.log(typeof aipass)
        if(typeof aipass !== 'undefined'){
            if(aipass === aicpass) {
                bcrypt.hash(aipass, 10).then((hash)=> {
                    User.findOneAndUpdate(
                        {'email': aiemail},{
                            $set: {
                                'first_name': aifname,
                                'last_name': ailname,
                                'email': aiemail,
                                'google.class': aiclass,
                                'departments': alidepartments,
                                'local.phone': aiphone,
                                'local.birthday': aidateob,
                                'local.password': hash
                            }
                        }, (err, user) =>{
                            if(err)
                                throw err
                            return res.render('accInfo', {code: 0, message: "Update information successfully"})
                        })
                })
            } else {
                return res.render('accInfo', {code: 1, message: "Confirm password does not match", info: req.session.User})
            }
        } else {
            User.findOneAndUpdate(
                {'email': aiemail},{
                    $set: {
                        'first_name': aifname,
                        'last_name': ailname,
                        'email': aiemail,
                        'google.class': aiclass,
                        'departments': alidepartments,
                        'local.phone': aiphone,
                        'local.birthday': aidateob
                    }
                }, (err, user) =>{
                    if(err)
                        throw err
                    return res.render('accInfo', {code: 0, message: "Update information successfully"})
                })
        }
    } else {
        let messages = result.mapped()
        let message = ''
        for (let m in messages) {
            message = messages[m].msg
            break
        }
        return res.redirect('./info')
    }

})

module.exports = Router