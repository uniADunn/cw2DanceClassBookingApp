const guestBookCourseModel = require('../models/guestCourseBookingModel');//guest booking model
//removes guest participants from course
exports.removeGuestCourseParticipant = async (req, res, next)=>{
    console.log('preparing remove guest participant from course...');
    //get guest email and course id from parameter
    let guestEmail = req.params.guestEmail;
    let courseId = req.params.courseId;
    //check if guest is in course
    console.log('check to see if guest participant is in the course...');
    const booking = await guestBookCourseModel.isGuestParticipantInCourse(guestEmail, courseId);
    console.log('guest participant booking: ', booking);
    //if booking not found 
    if(!booking || booking.length === 0){
        req.flash('error', 'no booking found');
        return res.status(404).redirect(`/auth/courseParticipants/${courseId}`);
    }
    if(booking){
        //booking found
        await guestBookCourseModel.removeGuestParticipant(booking._id).then((success)=>{
            if(!success){
                //failed to remove guest participant from course
                req.flash('error', 'error removing guest participant');
                return res.status(500).redirect(`/auth/courseParticipants/${courseId}`);
            }else{
                //remove successful
                //next middleware/end-point
                next()

            }
        }).catch(err=>{
            //error removing guest participant from course
            console.log('error removing guest participant from course:', err.message);
            req.flash('error', 'error: unable to remove particpant from course');
            return res.status(500).redirect(`/auth/courseParticipants/${courseId}`);
        });
    }

}