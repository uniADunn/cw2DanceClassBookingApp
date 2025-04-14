const nedb = require('gray-nedb');

//course booking model - used to store the bookings of courses for logged in users
class CourseBookingDAO{
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
            console.log('course booking database created');
        }
    }
    //creates booking
    create(course_id, user_id){
        console.log(`placing course booking...`);
        var entry = {
            course_id: course_id,
            user_id: user_id
        }
        //insert booking into db
        this.db.insert(entry, (err)=>{
            if(err){
                //error inserting db
                console.log(`cant insert booking: ${err}`);
            }else{
                //insert success
                console.log('course booking placed');
            }
        });
    }
    //gets a a list of bookings using the course id
    getBookingsByCourseID(courseId){
        //get a list of participants based on the classes id.
        return new Promise((resolve, reject)=>{
            this.db.find({'course_id': courseId},(err, bookings)=>{
                if(err){
                    //error getting bookings
                    console.log('error: getting bookings for course');
                    reject(err);
                }
                //no bookings found
                if(!bookings){                    
                    resolve(bookings);
                }
                //bookings found
                if(bookings){
                    console.log('retrieved participants ids');
                    resolve(bookings);
                }
            });
        });
    }
    //checks to see if a specific user has booked a specfic course
    isParticipantInCourse(userId, courseId){
        return new Promise((resolve, reject)=>{
            this.db.find({'user_id': userId, 'course_id':courseId}, (err, bookings)=>{
                if(err){
                    //error checking if user is a participant in course
                    reject(err);
                }else{
                    //booking found
                    console.log('this is the booking', bookings);
                    resolve(bookings);
                }
            });
        });
    }
    //looks up a booking based on its booking id
    lookUp(bookingId){
        return new Promise((resolve,reject)=>{
            this.db.find({'_id': bookingId}, (err, booking)=>{
                if(err){
                    //error looking up booking
                    console.log('error looking up booking');
                    reject(new Error('error looking up booking'));
                }
                //booking not found
                if(!booking){
                    console.log('booking not found');
                    reject(new Error('booking not found'));
                }else{
                    //booking found
                    console.log('booking found');
                    resolve(booking);
                }
            })
        });
    }
    //counts the specific bookings based on courseId
    courseParticipantCount(courseId){
        return new Promise((resolve, reject)=>{
            this.db.count({'course_id': courseId}, (err, count)=>{
                if(err){
                    //error getting count
                    console.log('participation count error');
                    reject(new Error('Error getting course participation count'));
                }
                else{
                    //counted participants in course
                    console.log('courses count', count);
                    //resovle with the count
                    resolve(count);
                }
            });
        })
    }
    //remove a booking using the booking id
    removeBooking(bookingId){
        return new Promise((resolve, reject)=>{
            this.lookUp(bookingId).then((booking)=>{
                if(!booking){
                    //booking not found
                    console.log('booking not found');
                    reject(new Error('booking not found'));
                }else{
                    //booking found - removing booking based on booking id
                    this.db.remove({'_id': bookingId}, {}, (err)=>{
                        if(err){
                            //error removing booking
                            reject(new Error('error deleting booking'));
                        }
                        else{
                            //remove booking success
                            console.log("booking deleted successful")
                            resolve(true);
                        }
                    });
                }

            })
        }).catch(err=>{
            //error removing booking 
            console.log(`error removing booking`, err.message);
            reject(new Error('Error removing booking'));
        })
    }
    
}
const dao = new CourseBookingDAO({filename: './data_store/courseBooking.db'});
module.exports = dao;