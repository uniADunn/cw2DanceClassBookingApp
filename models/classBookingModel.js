const nedb = require('gray-nedb');
//class booking model - holds registered users booking details
class ClassBookingDAO{
    //db constructor
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
            console.log('class booking database created');
        }
    }
    //create a new booking
    create(class_id, user_id){
        //create a class booking
        console.log(`placing booking...`);
        var entry = {
            class_id: class_id,
            user_id: user_id
        }
        //insert into db
        this.db.insert(entry, (err)=>{
            if(err){
                console.log(`cant insert booking: ${err}`);
            }else{
                console.log('booking placed');
            }
        });
    }
    //gets bookings by the class id
    getBookingsByClassID(classId){
        //get a list of participants based on the classes id.
        console.log(`getting bookings for class ${classId}...`);
        return new Promise((resolve, reject)=>{
            this.db.find({'class_id': classId},(err, bookings)=>{
                if(err){
                    //error getting participants for class
                    console.log('error: getting participants for class', err.message);
                    reject(err);
                }
                if(!bookings){
                    //no bookings were found
                    console.log('no bookings found for class', bookings);
                    reject(new Error('no bookings found'));
                }else{
                    //bookings found for class
                    console.log('bookings found for class', bookings);
                    resolve(bookings);
                }
                
            });
        });
    }
    //checks to see if user is in a specific class
    isParticipantInClass(userId, classId){
        return new Promise((resolve, reject)=>{
            this.db.find({'user_id': userId, 'class_id':classId}, (err, booking)=>{
                if(err){
                    //error finding user in class
                    reject(err);
                }else{
                    //user booking found
                    resolve(booking);
                }
            });
        });
    }
    //looks up a booking by id
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
    //removes a booking from the database based on the booking id
    removeBooking(bookingId){
        return new Promise((resolve, reject)=>{
            this.lookUp(bookingId).then((booking)=>{
                //booking not found
                if(!booking){
                    console.log('booking not found');
                    reject(new Error('booking not found'));
                }else{
                    //remove this booking from database
                    this.db.remove({'_id': bookingId}, {}, (err)=>{
                        if(err){
                            //error deleting booking
                            reject(new Error('error deleting booking'));
                        }
                        else{
                            //delete success
                            console.log("booking deleted successful")
                            resolve(true);
                        }
                    });
                }

            })
        }).catch(err=>{
            //error
            console.log(`error removing booking`, err.message);
            reject(new Error('Error removing booking'));
        })
    }
    //counts the the amount of bookings using the class id
    classParticipantCount(classId){
        return new Promise((resolve, reject)=>{
            this.db.count({'class_id': classId}, (err, count)=>{
                if(err){
                    //error counting bookings
                    console.log('participantion count error');
                    reject(new Error('Error getting class participation count'));
                }
                else{
                    //successfully counted bookings
                    console.log('class count', count);
                    //resolve with count
                    resolve(count);
                }
            });
        })
    }
}
const dao = new ClassBookingDAO({filename: './data_store/classBooking.db'});
module.exports = dao;