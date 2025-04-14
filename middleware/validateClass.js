const classModel = require('../models/classesModel');
const {body, validationResult} = require('express-validator');
exports.validateNewClass = [
  //class fields inputs to be validated
    body('classTitle')
      .isLength({ min: 3, max: 50}).withMessage('class title must be between 3 and 25 characters')
      .matches(/^[A-Za-z0-9 ]+$/).withMessage('class title can only contain letters, numbers and spaces. Special characters are invalid'),
  
    body('location')
      .isLength({ min: 3, max: 25 }).withMessage('location must be between 3 and 25 characters')
      .matches(/^[A-Za-z0-9 ]+$/).withMessage('location can only contain letters, numbers, and spaces. Special characters are invalid'),
  
    body('startDate')
    .isDate()
    .custom((value)=>{
      const date = new Date(value);
      const year = date.getFullYear();
      if(year <1900 || year > 2100){
        throw new Error('Date must be between 1900 and 2100');
      }else{
        return true;
      }
    }).withMessage('please enter a valid date'),
  
    body('startTime')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('please select a time in HH:MM 24hr format'),
  
    body('duration')
      .isNumeric().isInt().withMessage('please enter a valid number between 1 - 10')
      .isLength({ min: 1, max: 10 }).withMessage('please enter a valid number between 1 - 10'),
  
    body('cost')
      .isCurrency().withMessage('please enter a valid price'),
  
    body('description')
      .matches(/^[A-Za-z0-9 \r\n]+$/).withMessage('description accepts letters, numbers and spaces.'),
  
    (req, res, next) => {
      //get validation results
      const errors = validationResult(req);
      //if errors
      if (!errors.isEmpty()) {
        //render class form mapping errors to fields
        return res.render('admin/newClassForm', {
          title: 'New Class Form - Errors',
          admin: req.user,
          errors: errors.mapped(),
          formData: req.body
        });
      }else{
        //validation for class passed, continue
        console.log('Class Validation passed.\n');
        next();
      }
      
    }
  ];