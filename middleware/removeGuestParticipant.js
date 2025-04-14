const guestBookClassModel = require('../models/guestClassBookingModel');//guest booking class model
//removes a guest participant from class
exports.removeGuestParticipant = async (req, res, next) =>{
    console.log('preparing remove guest participant from class...');
    //get guest email and class id from parameter
    let guestEmail = req.params.guestEmail;
    let classId = req.params.classId;
    // check to see if guest is in class
    console.log('check to see if guest participant is in the class...');
    const booking = await guestBookClassModel.isGuestParticipantInClass(guestEmail, classId);
    console.log('guest participant booking: ', booking);
    //if no booking found
    if(!booking || booking.length === 0){
        req.flash('Error', 'no booking found');
        return res.status(404).redirect(`/auth/classParticipants/${classId}`);
    }
    if(booking){
        //booking found
        //remove guest particpant
        await guestBookClassModel.removeGuestParticipant(booking._id)
        .then((success)=>{
        if(!success){
            //failed to remove guest particpant from class
            req.flash('error', 'error removing guest participatn');
            return res.status(500).redirect(`/auth/classParticipants/${classId}`);
        }else{            
            //next middleware/end-point
            next();
        }
        }).catch(err=>{
            //error removing guest participant from class
            console.log('error removing guest participant', err.message);
            req.flash('error', 'error unable to remove guest participant');
            return res.status(500).redirect(`/auth/classParticipants/${classId}`);
        })
    }

}