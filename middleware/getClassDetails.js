const classBookingModel = require('../models/classBookingModel');//class booking model
const guestClassBookingModel = require('../models/guestClassBookingModel');// guest class booking model
const classModel = require('../models/classesModel');// class model
//gets class details
exports.getClassDetails = async (req, res, next)=>{
    try{
        //get all classes
        const classes = await classModel.getAllClasses();
        //creates a list with class details and calculates the participant count
        const classesNcounts = await Promise.all(
            //map cls
            classes.map(async (cls)=>{
                // get participant count use class id
                const count = await classBookingModel.classParticipantCount(cls._id);
                //get guest particpant count use class id
                const guestCount = await guestClassBookingModel.guestParticipantCount(cls._id);
                //display counts in console - debugging
                console.log('total user count: ', count);
                console.log('total guest count: ', guestCount);
                console.log('Total Count: ', count + guestCount)
                //return all data as is, modify cost to be 2 decimal places and attach totalcount to class details
                return {...cls, cost: Number(cls.cost).toFixed(2),
                    totalCount: count+guestCount
                }
            })
        );
        //display new list of classes with participant counts total
        console.log('classes with counts: ', classesNcounts);
        //set in request as class data
        req.classData = {
            classDetails: classesNcounts,
        }
        //next - middleware or endpoint
        next();
    }catch(err){
        //error getting class details and counts
        console.log('error getting class details');
        res.status(500).render('index',{
            title: 'error counting participants',
        })
    }
}