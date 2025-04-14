const express = require('express');
const {body, validationResult} = require('express-validator');

//validates login fields
exports.validateLogin = [
    body('username')
    .isLength({min:5, max:25}).withMessage('username must be between 5 and 25 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('username can only contain letters, numbers, underscore, and dashes'),

    body('pass')
    .isLength({min: 8}).withMessage('Password must be a minimum of 8 characters'),

    (req, res, next)=>{
        //get validation results
        const errors = validationResult(req);        
        //if errors
        if(!errors.isEmpty()){
            //return login page with errors mapped to fields
            return res.status(400).render('user/login',{
                title: 'Login page - validation errors',                
                errors: errors.mapped(),
                formData: req.body
                
            });
        }else{
            //validation passed, continue
            console.log('validation: passed');
            next();
        }
    }
]