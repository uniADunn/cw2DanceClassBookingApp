const classModel = require('../models/classesModel')//class model
const courseModel = require('../models/coursesModel');//course model
const classBookingModel = require('../models/classBookingModel');//class booking model
const courseBookingModel = require('../models/courseBookingModel');//course booking model
const guestClassBookingModel = require('../models/guestClassBookingModel');//guest class booking model
const guestCourseBookingModel = require('../models/guestCourseBookingModel');//guest course booking model
const jwt = require('jsonwebtoken');//json webtoken module

//classes functionality
//show all classes bases on role
exports.show_all_classes = async (req, res)=>{
    console.log('getting all classes...')
    //get user details
    let user = req.user;
    // get the class details
    let classDetails = req.classData.classDetails;
    console.log('class details at render: ', classDetails);
    
    try{
        //if no user recognized - must be guest
        if(!user){
            console.log('guest user');
            //render all classes with guest buttons
            res.status(200).render('allClasses',{
                title: 'available classes - guest',
                guest: true,
                classDetails: classDetails,                
            });
        }else{
            //user recognized
            //get user role
            let role = req.user.role;
            if(role == 'ADMIN'){
                //user is admin get admin buttons
                console.log('admin user');
                res.status(200).render('allClasses',{
                    title: 'available classes - admin',
                    admin: req.user,
                    classDetails : classDetails,
                });
            }else if(role=='USER'){
                //user is a regular user
                console.log('user role');
                res.status(200).render('allClasses',{
                    title: 'available classes - user',
                    user: req.user,
                    classDetails: classDetails
                });
            }
            //could add instructor role here        
        }
    }catch(err){
        //error getting list of classes
        console.log('Error getting classes list');
        res.status(500).render('index',{
            title: 'error retrieving class list',
            
        })
    }
}
// books class if user is logged in or routes guest users to class booking form
exports.bookClass = (req, res)=>{
    //get the class id
    const class_id = req.params.classId;
    //check if the user is has an id or if not set to nul
    const userId = req.user ? req.user.id : null;
    console.log(`the class id: ${class_id}\nthe user id: ${userId}`);
    //check if the userId is null
    if(userId == null){
        //user id is null -guest user needs guest class booking form
        console.log('user is not logged in send to guest booking form');
        //get class by id
        classModel.getClassById(class_id).then((cls)=>{
            //map the dance class cost 
            cls = cls.map(danceClass =>{
                //keep details the same, change only the cost data to 2 decimal places
                return {...danceClass, cost:Number(danceClass.cost).toFixed(2)}
            });            
            
            return res.status(200).render('guestBookingClass',{
                title: 'Guest Class Booking',
                classes: cls,
                guest: true,                
            });
        });
    }
    else{        
        try{
            //user is logged in make booking
            classBookingModel.create(class_id, userId);
            req.flash('success_msg', 'booking placed successfully');
            //could go to user profile of all bookings - future development
            res.status(200).redirect('/show_all_classes');
        }catch(e){
            console.log('error placing booking');
            res.status(500).redirect('/allClasses');
        }        
    }
}
//guest booking class
exports.guestBookClass =  (req, res)=>{
    //get class id from parameter
    let class_id = req.params.classId;
    //get form data
    let email = req.body.guestEmail;
    let firstName = req.body.firstName;
    let surname = req.body.surname;
    //get class data
    //let classData = req.classData;
    
    //console.log(`class id: ${class_id}\nemail: ${email}\nfirstname: ${firstName}\nsurname: ${surname}\nClass Data: `, classData);    
    try{
        //create guest booking
        guestClassBookingModel.create(email, firstName, surname, class_id)
        req.flash('success_msg', 'booking placed successfully');
        //could go to user profile of all bookings
        res.status(200).redirect('/show_all_classes');
    }catch(e){
        req.flash('error_msg', 'error placing booking')
        console.log('error placing booking', e.message);
        res.status(500).redirect('/show_all_classes');
    }
}
//courses functionality
//show all courses based on role
exports.show_all_courses = async (req, res)=>{
    console.log('\ngetting all courses...')
    //get user details
    let user = req.user;
    //get course data
    let courseData = req.courseData
    console.log('course details at render: ', courseData);
    try{
        //if user is not recognized
        if(!user){
            //guest user
            console.log('guest user');
            //render guest view
            res.status(200).render('allCourses',{
                title: 'available courses - guest',
                guest: true,
                courseDetails: courseData.courseDetails,                
            });
        }else{
            //user logged in get user role
            let role = req.user.role;
            //check role is admin user
            if(role === 'ADMIN'){
                //user is admin
                console.log('admin user');
                //render admin view
                res.status(200).render('allCourses',{
                    title: 'available courses - admin',
                    admin: req.user,
                    courseDetails : courseData.courseDetails,
                });
            }
            if(role === 'USER'){
                //user is regular user
                console.log('user role');
                //render user view
                res.status(200).render('allCourses',{
                    title: 'available courses - user',
                    user: req.user,
                    courseDetails: courseData.courseDetails
                });
            }            
    }
    }catch(err){
        //error getting courses list
        console.log('error getting courses list');
        res.status(500).render('allCourses',{
            title: 'error retrieving course list',              
        });
    }
}
//book a course or send guest to course booking form
exports.bookCourse = (req, res)=>{
    //get course id from parameter
    const courseId = req.params.courseId;
    //get user id if user logged in or set to null if guest
    const userId = req.user ? req.user.id : null;
    console.log(`the course id: ${courseId}\nthe user id: ${userId}`);
    //check if id is null
    if(userId == null){
        //guest user - guest booking form required
        console.log('user is not logged in send to guest booking form');
        //get course by course id
        courseModel.getCourseById(courseId).then((crs)=>{
            //iterate through crs
            crs = crs.map(danceCourse =>{
                //return course details as is, change only cost data to 2 decimal places
                return {...danceCourse, cost:Number(danceCourse.cost).toFixed(2)}
            });
            
            return res.status(200).render('guestBookingCourse',{
                title: 'guest course booking',
                courseDetails: crs,
                guest: true
            });
        });
    }else{
        //logged in user
        try{
            courseBookingModel.create(courseId, userId);
            req.flash('success_msg', 'booking placed successfully');
            //could go to user profile of all bookings
            res.status(200).redirect('/show_all_courses');
        }catch(e){
            //error placing booking
            req.flash('error_msg', 'error placing course booking');
            console.log('error placing course booking');
            res.status(500).redirect('allCourses')
        }
    }

}
//guest booking course
exports.guestBookCourse = (req, res)=>{
    //get course from parameter
    let courseId = req.params.courseId;
    //get guest details from from 
    let email = req.body.guestEmail;
    let firstname = req.body.firstName;
    let surname = req.body.surname;
    //let courseData = req.courseData;
    try{
        guestCourseBookingModel.create(email, firstname, surname, courseId);
        req.flash('success_msg', 'booking placed successfully');
        //could go to user profile page
        res.status(200).redirect('/show_all_courses');
    }catch(err){
        //error placing guest course boooking
        req.flash('error_msg', 'error placing guest course booking');
        console.log('error placing course booking');
        res.status(500).redirect('/show_all_courses');
    }
}
//ADMIN FUNCTIONALITY
//classes
// add a new class
exports.addNewClass = async (req, res)=>{
    // add class to data base then view admin control page once added show success or fail message
    //get form data
    const formData = req.body;
    //extract data
    const classTitle = formData.classTitle;
    const location = formData.location;
    const startDate = formData.startDate;
    const startTime = formData.startTime;
    const duration = formData.duration;
    const cost = formData.cost;
    const description = formData.description;
    // console.log('formData', formData)
    var fbMsg = "";
    try{
        //add new class
        console.log('adding new class...')
        await classModel.create(classTitle, startDate, startTime, duration, location, description, cost)
        console.log('class added successfully');
        
        //render class admin class list
        req.flash('class added successfully');
        res.status(200).redirect('/auth/editClassesList');
    }catch(err){
        //error adding new class
        console.log("error: ", err.message);
        fbMsg = "failed adding class"
        res.status(500).render('admin/editClassesList',{
            title: 'error adding class- admin',
            admin: req.user,
            fbMsg_fail: fbMsg,
        });
    }
}
//saves changes to classes
exports.postEditClass = (req, res)=>{
    //get class id from parameter
    const classId = req.params.classId;
    // console.log('class id', formData);
    //get form data changes
    let class_title = req.body.classTitle;
    let start_date = req.body.startDate;
    let start_time = req.body.startTime;
    let duration = req.body.duration;
    let location = req.body.location;
    let description = req.body.description;
    let cost = req.body.cost;
    //update class
    classModel.updateClass(classId, class_title, start_date, start_time, duration, location, description, cost)
    .then(()=>{
        //success class updated
        res.status(200).render('admin/editClassesList',{
            title: 'classes list - admin',
            admin: req.user,
            success_msg: 'Class edited successfully.'
        });    
    }).catch(err =>{
        //error updating class
        console.log('error: ', err.message);
        res.status(500).render('admin/editClassesList',{
            title: 'error editing class - admin',
            admin: req.user,
            error: 'failed updating class!'
        })
    });
}
//delete class
exports.deleteClass = (req, res)=>{
    //get the class id from the parameter
    let classId = req.params.classId;
    //remove class
    classModel.remove(classId)
    .then(()=>{
        //successfully deleted
        //render class list - admin
        req.flash('success_msg', 'deleted class successfully');
        res.status(200).redirect('/auth/editClassesList');
    }).catch(err=>{
        //error deleting class
        console.log('error: ', err.message);
        res.status(500).redirect('/auth/editClassesList');
    });
}
// get class paricipants for class
exports.get_classParticipants = (req, res)=>{
    console.log('populating class participants...')
    //get class data
    let classData = req.classData;
    console.log('class data: ', classData);
    //extract data
    let classDetails = classData.classDetails;
    let userDetails = classData.userDetails;
    let guestDetails = classData.guestDetails;
    let userCount = classData.userCount;
    let guestCount = classData.guestCount;
    let totalCount = classData.totalCount;
    let noParticipants = classData.noParticipants;
    //render class participation list
    res.status(200).render('instructor/classParticipationList',{
        title: 'class participants',
        admin: req.user,
        classDetails: classDetails,
        userDetails: userDetails,
        guestDetails : guestDetails,
        userCount: userCount,
        guestCount: guestCount,
        totalCount: totalCount,
        noParticipants: noParticipants
        
    });

}
// removes a regular user from class
exports.removeParticipantFromClass = async (req, res)=>{    
    //removal was a success
    req.flash('success_msg', 'removed participant successfully');
    res.status(200).render('instructor/classParticipationList',{
        title: 'class participants',
        admin: req.user,
        classDetails: req.classData.classDetails,
        userDetails: req.classData.userInfo,
        guestDetails: req.classData.guestInfo,
        userCount: req.classData.userCount,
        guestCount: req.classData.guestCount,
        totalCount: req.classData.totalCount,
        noParticipants: req.classData.noParticipants,
        success: 'Participant removed successfully'
    });                    
}
//remove guest participant
exports.removeGuestParticipantFromClass = async(req, res)=>{
    //removal was successful
    req.flash('success', 'guest participant removed successfully');
    res.status(200).redirect(`/auth/classParticipants/${req.params.classId}`);
}
//courses
//add a new course
exports.addNewCourse = (req, res)=>{
    //get form data
    const formData = req.body;
    //extract data
    const courseTitle = formData.courseTitle;
    const location = formData.location;
    const courseDuration = formData.courseDuration;    
    const courseStartDate = formData.courseStartDate;
    const classStartTime = formData.classStartTime;
    const classDuration = formData.classDuration;
    const description = formData.description;
    const cost = formData.cost;
    //set min date as tomorrow - not working properly?
    let today = new Date()
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);
    formData.minCourseStartDate = tomorrow.toISOString().split('T')[0];
    //set form data attributes
    formData.minClassStartTime = '08:00';
    formData.maxClassStartTime = '22:00';
    formData.stepTime = '300';
    console.log('Courses form Data: ', formData);
    var fbMsg = "";
    try{
        //add new course
        console.log('Adding new course...');
        courseModel.create(courseTitle, courseStartDate, courseDuration, classStartTime, classDuration, location, description, cost);
        console.log('course added successfully');
        fbMsg = "course added successfully"
        req.flash('success_msg', 'new courses added');
        res.status(200).redirect('/auth/editCoursesList');
    }catch(err){
        //error adding new course
        console.log('error: ', err.message);
        fbMsg = "failed adding course";
        res.status(500).render('admin/editCoursesList',{
            title: 'error adding course - admin',
            admin: req.user,
            fbMsg_fail: fbMsg
        });
    }
}
//delete course
exports.deleteCourse = (req, res)=>{
    //get course id from parameter
    let courseId = req.params.courseId;
    //remove course
    courseModel.remove(courseId)
    .then(()=>{
        //success
        req.flash('success_msg', 'course deleted successfully');
        res.status(200).redirect('/auth/editCoursesList');
    }).catch(err=>{
        //error deleting course
        console.log('error: ', err.message);
        res.status(500).render('admin/editCoursesList',{
            title: 'error - control page',
            error_msg: 'error: failed to delete course!',
            admin: req.user
        });
    });
}
// make edit changes to course details
exports.postEditCourse = (req, res)=>{
    //get course id from parameter
    const courseId = req.params.courseId;
    //get course details
    const courseDetails = req.body;
    //extract data
    let course_title = courseDetails.courseTitle;
    let location = courseDetails.location;
    let courseDuration = courseDetails.courseDuration;
    let courseStartDate = courseDetails.courseStartDate;
    let classStartTime = courseDetails.classStartTime;
    let classDuration = courseDetails.classDuration;
    let description = courseDetails.description;
    let cost = courseDetails.cost;
    //update course
    courseModel.updateCourse(
        courseId,
        course_title,
        courseStartDate,
        courseDuration,
        classStartTime,
        classDuration,
        location,
        description,
        cost
    ).then(()=>{
        //success
        req.flash('success_msg', 'successfully edited course')
        res.status(200).redirect('/auth/editCoursesList');
    }).catch(err =>{
        //error making changes to course
        req.flash('error_msg', 'failed to update course');
        console.log('error: ', err.message);
        res.status(500).render('admin/controlPage',{
            title: 'error - admin control page',
            admin: req.user,
            error: 'failed updating course!'
        });
    });
}
//get course participants
exports.get_courseParticipants = (req, res)=>{
    //getting participants successful
    console.log('populating course participants...')
    //get course data
    let courseData = req.courseData
    console.log('course data: ', courseData);
    //extract course data
    let courseDetails = courseData.courseDetails;
    let userDetails = courseData.userDetails;
    let guestDetails = courseData.guestDetails;
    let userCount = courseData.userCount;
    let guestCount = courseData.guestCount;
    let totalCount = courseData.totalCount;
    let noParticipants = courseData.noParticipants;
    //render participation list for course
    res.status(200).render('instructor/courseParticipationList',{
        title: 'course participants',
        admin: req.user,
        courseDetails: courseDetails,
        userDetails: userDetails,
        guestDetails: guestDetails,
        userCount: userCount,
        guestCount: guestCount,
        totalCount: totalCount,
        noParticipants: noParticipants
    });
}
exports.removeParticipantFromCourse = (req, res)=>{
    //remove particpant successful
    //render course participant list
    req.flash('success_msg', 'participant removed successfullly')
    res.status(200).render('instructor/courseParticipationList',{
        title: 'course participants',
        admin: req.user,
        courseDetails: req.courseData.courseDetails,
        userDetails: req.courseData.userInfo,
        guestDetails: req.courseData.guestInfo,
        userCount: req.courseData.userCount,
        guestCount: req.courseData.guestCount,
        totalCount: req.courseData.totalCount,
        noParticipants: req.courseData.noParticipants,
        success: 'Participant removed successfully'
    })
}
//remove guest participant from course
exports.removeGuestParticipantFromCourse = (req, res)=>{
    //removal was successful
    req.flash('success', 'guest particiapant removed successfully');
    res.status(200).redirect(`/auth/courseParticipants/${req.params.courseId}`);

}