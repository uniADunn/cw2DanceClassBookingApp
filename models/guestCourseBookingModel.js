const nedb = require('gray-nedb');
//guest course booking model - holds guest information who booked a course
class GuestCourseBookingDAO{
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
            console.log('guest course booking database created');
        }
    }

    init(){
        let email = 'some1@live.com';
        let fname = 'meg';
        let lname = 'griffen';
        let courseId = '3sU4jygIGjKvYG93';

        try{
            this.create(email, fname, lname, courseId);
        }catch(err){
            console.log('error: ', err.message);
        }

    }
    //creates a new gust booking a class
    create(email, firstName, surname, courseId){
        //create guest booking class
        console.log(`placing guest booking...`);
        var entry = {
            course_id: courseId,
            guestEmail : email,
            firstName : firstName,
            surname : surname
        }
        //insert new guest booking
        this.db.insert(entry, (err)=>{
            if(err){
                //error inserting course booking
                console.log(`cant insert guest booking: ${err.message}`);
            }else{
                //booking placed
                console.log('booking placed');
            }
        });
    }
    //get guest bookings by course id
    getGuestBookingsByCourseID(courseId){
        //get a list of guest participants by the classes id.
        return new Promise((resolve, reject)=>{
            this.db.find({'course_id': courseId}, (err, guestBookings)=>{
                if(err){
                    //error getting guest bookings
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
                    //bookings found
                    console.log('retrieved guest bookings', guestBookings);
                    resolve(guestBookings);
                }
            });
        })
    }
    //checks if a guest is participating in a course using guest email and course id
    isGuestParticipantInCourse(email, courseId){
        console.log(`searching guests participants for: ${email}`);
        return new Promise((resolve, reject)=>{
            this.db.findOne({'course_id': courseId, 'guestEmail': email}, (err, booking)=>{
                if(err){
                    //error checking if guest is in course
                    reject(err);
                }else{
                    //booking has been found with this email
                    resolve(booking);
                }
            });
        });
    }
    //count participants in course
    guestParticipantCount(courseId){
        return new Promise((resolve, reject)=>{
            this.db.count({'course_id': courseId}, (err, count)=>{
                if(err){
                    //error getting participation count
                    console.log('participantion count error');
                    reject(new Error('Error getting guest course participation count'));
                }
                else{
                    //participants counted
                    console.log('course count', count);
                    //resolve with participant count
                    resolve(count);
                }
            });
        })
    }
    //remove guest participant based on the booking id
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
const dao = new GuestCourseBookingDAO({filename: './data_store/guestCourseBooking.db'});
// dao.init()
module.exports = dao;