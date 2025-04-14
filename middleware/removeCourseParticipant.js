const courseBookingModel = require('../models/courseBookingModel');//course booking model
//removes participants from course
exports.removeCourseParticipant = async(req, res, next)=>{
    console.log('preparing remove participant from course');
    //get userId and course id from parameter
    let userId = req.params.userId;
    let courseId = req.params.courseId;
    //check to see if the user is in the course
    console.log('checking to see if participant is in the course');
    const booking = await courseBookingModel.isParticipantInCourse(userId, courseId);
    console.log('participant booking: ', booking);
    //check if ther is a booking - should only be one
    if(!booking || booking.length === 0){
        req.flash('error', 'no booking found');
        return res.status(404).redirect(`/auth/courseParticipants/${courseId}`);
    }
    if(booking){
        //booking found - remove it
        await courseBookingModel.removeBooking(booking[0]._id).then((success)=>{
            if(!success){
                //failed to remove
                req.flash('error', 'error removing participant from course');
                return res.status(500).redirect(`/auth/courseParticipants/${courseId}`);
            }
            else{
                //remove success
                req.flash('success', 'removed participant from course');
                return res.status(200).redirect(`/auth/courseParticipants/${courseId}`);
            }
        }).catch(err=>{
            //error removing participant
            console.log('error removing participant from course', err.message);
            req.flash('error', 'error unable to remove participant from course');
            return res.status(500).redirect(`/auth/courseParticipants/${courseId}`);
        });
    }
} 