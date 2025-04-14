const nedb = require('gray-nedb');
// guest class booking model - used to store data about guest that book classes
class GuestClassBookingDAO{
    constructor(dbFilePath){
        if(dbFilePath){
            //embedded
            this.db = new nedb({
                filename: dbFilePath.filename,
                autoload: true
            });
            console.log(`database connected to: ${dbFilePath.filename}`);
        }else{
            //in memory
            this.db = new nedb();
            console.log('guest class booking database created');
        }
    }
    init(){
        let email = 'some1@live.com';
        let fname = 'meg';
        let lname = 'griffen';
        let classId = '3sU4jygIGjKvYG93';

        try{
            this.create(email, fname, lname, classId);
        }catch(err){
            console.log('error: ', err.message);
        }

    }
    //creates a new guest class booking ussing email firstname surname and the class id
    create(email, firstName, surname, classId){
        //create guest booking class
        console.log(`placing guest booking...`);
        var entry = {
            class_Id: classId,
            guestEmail : email,
            firstName : firstName,
            surname : surname
        }
        //inserts new booking
        this.db.insert(entry, (err)=>{
            if(err){
                //error inserting booking
                console.log(`cant insert guest booking: ${err.message}`);
            }else{
                //booking placed
                console.log('booking placed');
            }
        });
    }
    //gets a list of guests bookings by the class id
    getGuestBookingbyClassID(classId){
        //get a list of guest participants by the classes id.
        return new Promise((resolve, reject)=>{
            this.db.find({'class_Id': classId}, (err, guestBookings)=>{
                if(err){
                    console.log('error getting guest bookings');
                    reject(err);
                }
                //no guest bookings found
                if(!guestBookings){
                    console.log('its NOT !', guestBookings);
                    resolve(guestBookings);
                }
                //bookings found
                if(guestBookings){
                    console.log('retrieved guest bookings', guestBookings);
                    resolve(guestBookings);
                }
            });
        })
    }
    //checks to see if a guest is participant in a course
    isGuestParticipantInClass(email, classId){
        console.log(`searching guests participants for: ${email}`);
        return new Promise((resolve, reject)=>{
            this.db.findOne({'class_Id': classId, 'guestEmail': email}, (err, booking)=>{
                if(err){
                    //error checking participant is in class
                    reject(err);
                }else{
                    //booking returned
                    resolve(booking);
                }
            });
        });
    }
    //counts the amount of bookings of the class using the class id
    guestParticipantCount(classId){
        return new Promise((resolve, reject)=>{
            this.db.count({'class_Id': classId}, (err, count)=>{
                if(err){
                    //error counting participants
                    console.log('participantion count error');
                    reject(new Error('Error getting class participation count'));
                }
                else{
                    //count success
                    console.log('class count', count);
                    //return the count of participants
                    resolve(count);
                }
            });
        })
    }
    //removes a guest participant from the class
    removeGuestParticipant(bookingId){
        console.log('removing guest participant...');
        return new Promise((resolve, reject)=>{
            this.db.remove({_id: bookingId}, {}, (err)=>{
                if(err){
                    //error removing guest participant
                    console.log('error removing guest participant', err.message);
                    reject(new Error('error removing guest participanat'));
                }
                else{
                    //guest participant removed
                    console.log('removed guest participant');
                    resolve(true);
                }
            })
        });
    }
}
const dao = new GuestClassBookingDAO({filename: './data_store/guestClassBooking.db'});
// dao.init()
module.exports = dao;