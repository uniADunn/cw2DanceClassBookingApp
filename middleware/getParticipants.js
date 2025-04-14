const classBookingModel = require('../models/classBookingModel');
const guestClassBookingModel = require('../models/guestClassBookingModel');
const userModel = require('../models/userModel');
const classesModel = require('../models/classesModel');

exports.getParticipants = async (req, res, next)=>{
    try{
        console.log('getting participants...');
        //get class id from params
        console.log('collect class id from params...');
        let classId = req.params.classId;
        console.log('class id retrieved: ', classId);
        //get class
        let danceClass = await classesModel.getClassById(classId);
        //no class was found
        if(!danceClass){
            //class not found.
            req.flash('error_msg', 'Class not found');
            res.status(404).redirect('instructor/editClassesList');
        }
        //class found
        console.log('class found: ', danceClass);
        //get participant bookings for class
        console.log('gathering bookings for users')
        let participantBookings = await classBookingModel.getBookingsByClassID(classId); 
        console.log('user bookings found...');   
        //get guest participant bookings for class
        console.log('gathering bookings for guests...');
        let guestparticipantBookings = await guestClassBookingModel.getGuestBookingbyClassID(classId);
        console.log('guest bookings found...');
        //map participant details 
        console.log('gathering participant details for class...');
        const participantDetails = await Promise.all(participantBookings.map(async(booking)=>{
            console.log('fetching user ', booking.user_id);
            const user = await userModel.getUserById(booking.user_id);                       
            return{
                firstname: user.firstname,
                surname: user.surname,
                email: user.email,
                userId: user._id

            }
        }));
        console.log('Participant details complete...'); 
        //map guest participant details to a new list
        const guestDetails = guestparticipantBookings.map((guestBooking)=>({
            firstName: guestBooking.firstName,
            surname: guestBooking.surname,
            guestEmail: guestBooking.guestEmail
        }
        ));
        console.log('Guest details complete...');
        //if both lists are empty - no participants for class
        if(guestDetails.length <= 0 && participantDetails.length <= 0){
            req.classData = {
                classDetails : danceClass,
                userDetails: participantDetails,
                guestDetails: guestDetails,
                userCount: 0,
                guestCount: 0,
                totalCount: 0,
                noParticipants: true
            }
            
        }else{
            //participants found
            req.classData = {
                classDetails : danceClass,
                userDetails: participantDetails,
                guestDetails : guestDetails,
                userCount : participantDetails.length,
                guestCount : guestDetails.length,
                totalCount : (guestDetails.length + participantDetails.length),
                noParticipants: false
            }
        
        }
        console.log('Getting participants completed.\n');
        //next middleware / end-point
        next();
    }catch(err){
        //error getting participant details for class
        console.log('error getting participants details');
        res.status(500).render('intstructor/editClassesList',{
            title: 'error getting details',
            admin: req.user,
            fbMsg_fail: 'failed in middleware getting participants'
        });
    }
}