const coursesModel = require('../models/coursesModel');//courses model
const courseBookingModel = require('../models/courseBookingModel');//get course booking model
const guestCourseBookingModel = require('../models/guestCourseBookingModel');//guest course booking model
const userModel = require('../models/userModel');//user model
//gets course participants
exports.getCourseParticipants = async (req, res, next)=>{
    try{
        console.log('getting course participants...');
        //get course id from parameter
        let courseId = req.params.courseId;
        //get course with course id
        let danceCourse = await coursesModel.getCourseById(courseId);
        //if there is no dance course returned
        if(!danceCourse){
            //class not found.
            console.log('course not found');
            return res.status(404).redirect('instructor/editCoursesList');            
        }
        //course found
        console.log('course found: ', danceCourse);
        //get course bookings by courseid
        console.log('gathering bookings for users and guests...');        
        let courseParticipantBookings = await courseBookingModel.getBookingsByCourseID(courseId);
        console.log('user bookings found: ', courseParticipantBookings);
        //get guest bookings by course id
        console.log('gathering guest bookings...')
        let guestCourseParticipantBookings = await guestCourseBookingModel.getGuestBookingsByCourseID(courseId);
        console.log('guest bookings found: ', guestCourseBookingModel);
        //create new list with user details and guest details
        console.log('gathering participant details for course...');
        const courseParticipantDetails = await Promise.all(courseParticipantBookings.map(async(booking)=>{
            console.log('getting user details for: ', booking.user_id);
            const user = await userModel.getUserById(booking.user_id);
            return{
                firstname: user.firstname,
                surname: user.surname,
                email: user.email,
                userId: user._id
            }
        }));
        console.log('participant details complete...');
        //create new list with guest details
        const guestCourseParticipantDetails = guestCourseParticipantBookings.map((guestBooking)=>{
            return{
                firstName: guestBooking.firstName,
                surname: guestBooking.surname,
                guestEmail: guestBooking.guestEmail
            }
        });
        console.log('course guest participant details complete...');
        //if both lists are empty - no participants in course
        if(guestCourseParticipantDetails.length <= 0 && courseParticipantDetails.length <= 0){
            // set request body with course data
            req.courseData = {
                courseDetails: danceCourse,
                userDetails: courseParticipantDetails,
                guestDetails: guestCourseParticipantDetails,
                userCount: 0,
                guestCount: 0,
                totalCount: 0,
                noParticipants: true
            }
        }
        else{
            //participants found
            //set request body with course data
            req.courseData = {
                courseDetails: danceCourse,
                userDetails: courseParticipantDetails,
                guestDetails: guestCourseParticipantDetails,
                userCount: courseParticipantDetails.length,
                guestCount: guestCourseParticipantDetails.length,
                totalCount: courseParticipantDetails.length + guestCourseParticipantDetails.length,
                noParticipants: false                
            }
        }
        console.log('getting course participants completed.\n');
        //got participants proceed
        next();
    }catch(err){
        //error getting participants for course
        console.log('error getting course participants details: ', err.message);
        res.status(500).render('instructor/editCoursesList', {
            title: 'error getting course participants details',
            admin: req.user,
            fbMsg_fail: 'error getting course participants details'
        });
    }
}