const classBookingModel = require('../models/classBookingModel');
const courseBookingModel = require('../models/courseBookingModel');
const classModel = require('../models/classesModel');
const guestclassBookingModel = require('../models/guestClassBookingModel')
const guestCourseBookingModel = require('../models/guestCourseBookingModel');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

//checks if participant has booked a class or not
exports.participantCheck = (req,res,next)=>{
    //check to see if user has already booked
    console.log('checking participation...');
    //check token
    let tkn = req.cookies.jwt;
    if(!tkn){
        console.log('no token to check participation? could be guest.');
        req.user = null;
        return next();
    }else{
        //get class id from parameter
        let class_id = req.params.classId;
        console.log(class_id,);
        //verify cookie
        const user = jwt.verify(tkn, process.env.SECRET_ACCESS_TOKEN);                
        console.log('userid: ', user.id);
        //check if participant is in class
        classBookingModel.isParticipantInClass(user.id, class_id).then((booking)=>{
            // console.log(booking);
            if(booking.length == 0){
                //no booking found
                console.log('previous booking not found, proceed to booking');
                return next();
            }
            else{
                //bookin found                            
                req.flash('error_msg', 'You have already booked this class');
                console.log('user has already booked this class');
                res.status(403).redirect('/show_all_classes');
            }
        });        
    }
}
//course participant check
exports.courseParticipantCheck = (req, res, next)=>{
    console.log('checking course participation...');
    //get token
    let tkn = req.cookies.jwt;
    //if no token
    if(!tkn){
        //check guest email???
        console.log('no token to check participation, could be guest.');
        req.user = null;
        return next();
    }else{
        // user has tkn get course id from parameter
        let courseId = req.params.courseId;
        console.log('course id: ', courseId);
        //verify token
        const user = jwt.verify(tkn, process.env.SECRET_ACCESS_TOKEN);
        console.log('user ID: ', user.id);
        //check if participant is in course
        courseBookingModel.isParticipantInCourse(user.id, courseId).then((booking)=>{
            //no booking found
            if(booking.length == 0){
                //proceed
                console.log('previous booking not foundm, preceed to booking');
                return next();
            }else{
                //error user has already booked
                req.flash('error_msg', 'you have already booked this course');
                console.log('user has already booked this course');
                res.status(403).redirect('/show_all_courses');
            }
        });
    }

}
//guest course participant check
exports.guestCourseParticipantCheck = (req, res, next)=>{
    //get email and course id from parameter
    let email = req.body.guestEmail;
    let courseId = req.params.courseId;
    //check to see if guest is a participant in course
    guestCourseBookingModel.isGuestParticipantInCourse(email, courseId).then((bookings)=>{
        console.log('booking list: ', bookings);
        //if booking not found
        if(bookings == null || bookings.length == 0){
            //not booked this class
            console.log('previous booking not found, proceed to booking');
            next();
        }
        else{
            //has booked this course with this email
            req.flash('error_msg', 'you have already booked this course');
            console.log('user has already booked this class');
            res.status(403).redirect('/show_all_courses');
        }
    });
}
//guest participant check for class
exports.guestParticipantCheck = (req, res, next)=>{
    // get email and class id from parameter
    let email = req.body.guestEmail;
    let classId = req.params.classId;
    //check to see if the guest is a participant in the class
    guestclassBookingModel.isGuestParticipantInClass(email,classId).then((bookings)=>{
        console.log('bookings list: ',bookings);
        //if no booking is found
        if(bookings == null || bookings.length == 0){
            //not booked this class
            console.log('previous booking not found, proceed to booking');
             next();
        }
        else{
            //has booked this class with this email.
            req.flash('error_msg', 'You have already booked this class');
            console.log('user has already booked this class');
            res.status(403).redirect('/show_all_classes');
        }
    });
}
//validates a guest booking form 
exports.validateGuestBooking = [
    //fields to be validated
    body('guestEmail')
    .isEmail().withMessage('Invalid email'),

    body('firstName')
    .isLength({min:3, max:25}).withMessage('firstname must be between 3 and 25 characters')
    .isAlpha().withMessage('firstname can only contain letters'),

    body('surname')
    .isLength({min:3, max:25}).withMessage('surname must be between 3 and 25 characters')
    .isAlpha().withMessage('surname can only contain letters'),
    //can add more in here

    async (req, res, next)=>{
        //get validation results
        const errors = validationResult(req);
        //if there is errors
        if(!errors.isEmpty()){            
            try{
                console.log('errors list: ', errors.array());
                //get class id from parameter
                let class_Id = req.params.classId;
                console.log('class id: ', class_Id);
                classModel.getClassById(class_Id).then((cls)=>{
                    console.log(cls);
                    console.log('form data', req.body);
                    //render form with errors mapped to fields
                    res.render('guestBookingClass',{
                        title: 'guest class booking',
                        errors: errors.mapped(),
                        classes: cls,
                        formData: req.body                        
                    });
                    
                });                                                
            }catch(err){
                console.log('error Validating guest booking: ', err,message);
                return res.status(500).send('server error');
            } 
        }else{
            //valid continue with booking
            next();
        }
        
        
    }
];