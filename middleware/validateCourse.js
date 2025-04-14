const courseModel = require('../models/coursesModel');
const {body, validationResult} = require('express-validator');
//validates new courses
exports.validateNewCourse = [
    //validate input fields from new course form 
    body('courseTitle')
        .isLength({min: 3, max: 50}).withMessage('course title must be between 3 and 50 characters')
        .matches(/^[A-Za-z0-9 ]+$/).withMessage('course title can only contain letters, numbers and spaces. Special characters are invalid'),

    body('location')
        .isLength({min: 3, max: 50}).withMessage('location must be between 3 and 50 characters')
        .matches(/^[A-Za-z0-9 ]+$/).withMessage('location can only contain letters, numbers and spaces. Special characters are invalid'),

    body('courseDuration')
        .isNumeric().isInt({min: 6, max:26}).withMessage('course duration must be a number between 6 and 26'),

    body('courseStartDate')
        .isDate()
        .custom((value)=>{
            const date = new Date(value);
            const year = date.getFullYear();
            if(year < 1900 || year > 2100){
                throw new Error('Date must be between 1900 and 2100');
            }else{
                return true;
            }
        }).withMessage('please enter a valid date'),

    body('classStartTime')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('please select a time in HH:MM 24hr format'),

    body('classDuration')
        .isNumeric().isInt({min: 1, max: 10}).withMessage('please enter a valid number between 1 - 10'),

    body('description')
        .matches(/^[A-Za-z0-9 \r\n]+$/).withMessage('description accepts letters, numbers and spaces.')
        .isLength({min: 0, max: 255}).withMessage('description must be between 0 and 255 characters'),

    body('cost')
        .isCurrency().withMessage('please enter a valid price'),

    (req, res, next)=>{
        //get validation results
        const errors = validationResult(req);
        //if error
        if(!errors.isEmpty()){
            //render new class form with errors mapped to fields
            return res.render('admin/newCourseForm',{
                title: 'New Course Form - Errors',
                admin: req.user,
                errors: errors.mapped(),
                formData: req.body
            });
        }else{
            //validation passed
            console.log('course validation passed.\n');
            next();
        }
    }

];