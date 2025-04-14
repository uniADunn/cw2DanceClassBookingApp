const express = require('express');
const {body, validationResult} = require('express-validator');

//validates new registration of users
exports.validateRegistration = [
    //validates input fields from register form
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
    //can add more in here later if needed...

    (req, res, next)=>{
        //get validation results
        const errors = validationResult(req);
        let formData = req.body;
        console.log("form data:", formData)
        //if errors
        if(!errors.isEmpty()){
            //render registration page with errors mapped
            res.status(400).render('user/register',{
                title:'registration',
                formData: req.body,
                errors: errors.mapped()
            });
        }else{            
            //validation passed
            console.log('validation of registration passed');
            next();
        }
    }

];


