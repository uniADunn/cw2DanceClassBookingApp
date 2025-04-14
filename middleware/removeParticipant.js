const classBookingModel = require('../models/classBookingModel');//class booking model
//removes participant from class
exports.removeParticipant = async(req, res, next)=>{
    console.log('preparing remove participant from class...');
    //get user id and class id from parameter
        let userId = req.params.userId;
        let classId = req.params.classId;
        //check if user is a participant in this class
        console.log('checking to see if participant is in the class...')
        const booking = await classBookingModel. isParticipantInClass(userId, classId);
        console.log('participant booking: ', booking);
        //if no booking found
        if(!booking || booking.length === 0){
            req.flash('Error' ,'No booking found');
            return res.status(404).redirect(`auth/classParticipants/${classId}`)
        }
        if(booking){
            //booking found - remove booking with booking id
            await classBookingModel.removeBooking(booking[0]._id).then((success)=>{                
                if(!success){
                    //failed to remove participant booking
                    req.flash('Error', 'error removing participant');
                    return res.status(500).redirect(`/auth/classParticipants/${classId}`);
                }
                else{
                    //successfully removed participant from class
                    req.flash('Success', 'Removed participant');
                    return res.status(200).redirect(`/auth/classParticipants/${classId}`);
                }
            }).catch(err=>{
                //error removing participant from class
                console.log('error removing participant', err.message);
                req.flash('error', 'error unable to delete particpant');
                return res.status(500).redirect(`/auth/classParticipants/${classId}`)
            })
            
        }
}