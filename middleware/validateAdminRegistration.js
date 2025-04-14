const express = require('express');//express
const {body, validationResult} = require('express-validator');//validator
const userModel = require('../models/userModel');//user model

exports.validateAdminRegistration = [
    //form fields and validation checks to be performed.
    body('firstname')
    .isLength({min:3, max:25}).withMessage('Firstname must be between 3 and 25 characters')
    .isAlpha().withMessage('firstname can only contain letters'),

    body('surname')
    .isLength({min:3, max:25}).withMessage('surname must be between 3 and 25 characters')
    .isAlpha().withMessage('surname can only contain letters'),

    body('email')
    .isEmail().withMessage('Invalid email'),

    body('username')
    .isLength({min:5, max:25}).withMessage('username must be between 5 and 25 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('username can only contain letters, numbers, underscore, and dashes'),

    body('pass')
    .isLength({min:7}).withMessage('Password must be at least 8 characters'),
    //can add more in here later...

    (req, res, next)=>{
        //get validation results
        const errors = validationResult(req);
        //if errors
        if(!errors.isEmpty()){
            // admin registration form map errors to fields
            res.status(400).render('admin/addAdminForm',{
                title: 'Admin Registration - Errors',
                formData: req.body,
                errors: errors.mapped(),
                admin: req.user
            });
        }else{
            //check if user name is taken or not
            userModel.lookup(req.body.username,(err,user)=>{
                if(err){
                    //error lookin up username
                    console.log('error during lookup of username');
                    res.status(500).redirect('admin/addAdminForm');
                }
                if(user){
                    //username taken
                    console.log(`admin username: ${req.body.username} already taken`);
                    res.status(401).render('admin/addAdminForm',{
                        title: 'error - username taken',
                        formData: req.body,
                        error_username: 'error - username taken',
                        admin: req.user
                    });
                }else{
                    //user name not taken and validation ok
                    //next middleware/end-point
                    next();
                }
                
            });
        }
    }
];