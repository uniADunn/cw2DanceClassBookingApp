const courseBookingModel = require('../models/courseBookingModel');//course booking model
const guestCourseBookingModel = require('../models/guestCourseBookingModel');//guest course booking model
const courseModel = require('../models/coursesModel');//courses model
//gets course details and participant count
exports.getCourseDetails = async(req, res, next)=>{
    try{
        //get all courses
        const courses = await courseModel.getAllCourses();
        console.log('getting courses n participant count...');
        //courses list  with class details and calculates the participant count
        const coursesNcounts = await Promise.all(
            //map courses
            courses.map(async(crs)=>{                    
                console.log('getting participant count for course: ', crs._id);
                // get participant count use course id
                const count = await courseBookingModel.courseParticipantCount(crs._id);
                //get guest participant count use course id
                const guestCount = await guestCourseBookingModel.guestParticipantCount(crs._id);
                //display counts for debugging
                console.log('total user count: ', count);
                console.log('total guest count: ', guestCount);
                console.log('Total Count: ', count + guestCount);
                //return all course data as is, modify cost to 2 decimal places and attach total counts to list
                return {...crs, cost:Number(crs.cost).toFixed(2),
                    totalCount: count+guestCount
                }
            })
        );
        console.log('courses with counts: ', coursesNcounts);
        //attach to req body as course data
        req.courseData = {
            courseDetails: coursesNcounts,
        }
        console.log('courses details and participant count: ', req.courseData);
        //next middleware / endpoint
        next();
    }catch(err){
        //error get course details and counts
        console.log('error getting courses details', err.message);
        res.status(500).render('index',{
            title: 'error getting courses',
        })
    }
}