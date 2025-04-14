const nedb = require('gray-nedb');
//course model database - stores information relating to a course such as name, start date, duration of course, start time of courses, location etc...
class CoursesDAO{
    //constructor
    constructor(dbFilePath){
        if(dbFilePath){
            //embedded db
            this.db = new nedb({
                filename: dbFilePath.filename,
                autoload: true
            });
            console.log(`database connected to: ${dbFilePath.filename}.`);
        }else{
            //in memory db
            this.db = new nedb();
            console.log('Courses database created');
        }
    }
    //populate the database with courses - used for testing(dummy data)
    init(){
        console.log('populating courses...');
        try{
            //set data
            let course_title = 'jazz class';
            let start_date = new Date().toISOString().split('T')[0];
            let course_duration = 12;
            let class_start_time = 1200;
            let class_duration = 2
            let location = 'bellshill dance studio';
            let description = 'some descriptive text about the dance class.';
            let cost = 12.50;
            //create course using db method
            this.create(course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost);
            this.create(course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost);
            this.create(course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost);
            this.create(course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost);
            console.log(`course inserted: ${classTitle}`);
            console.log('course poplating complete.');
        }catch(err){
            console.log(`Error: ${err.message}`);
        }

    }
    //create new course entries into db
    create(course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost){
        console.log(`creating new course: ${course_title}\nPlease wait...`);
        return new Promise((resolve, reject)=>{
            //the course data entries
            var entry = {
                course_title: course_title,
                start_date: start_date,
                course_duration: course_duration,
                class_start_time: class_start_time,
                class_duration: class_duration,
                location: location,
                description: description,
                cost: cost
            }
            //insert into db
            this.db.insert(entry, (err)=>{
                if(err){
                    //error inserting into database
                    console.log(`cant insert course: ${course_title}`);
                    reject(err);
                }else{
                    //insert success
                    console.log(`class inserted: ${course_title}`);
                    resolve();
                }
            });
        });
        
    }
    //gets all the courses
    getAllCourses(){
        return new Promise((resolve, reject)=>{
            this.db.find({},(err, courses)=>{
                if(err){
                    //error getting courses
                    console.log(`Error getting all coarses ${err.message}`);
                    reject(err);
                }else{
                    //retrieved all courses
                    console.log('list of courses: ', courses);
                    resolve(courses);
                }
            });
        });
    }
    //gets a course by the course id
    getCourseById(course_id){
        return new Promise((resolve, reject)=>{
            this.db.find({'_id': course_id},(err, crs)=>{
                if(err){
                    //error getting course by id
                    reject(err);
                }else{
                    //course found
                    resolve(crs);
                }
            });
        });
    }
    //course look up by course title
    lookup(courseTitle, cb){
        console.log(`looking up dance course: ${courseTitle}\nPlease wait...`);
        this.db.find({'course_title': courseTitle}, (err, courses)=>{
            if(err){
                console.log(`error during course lookup: ${err.message}`);
                return cb(null, null);
            }
            if(courses.length == 0){
                console.log(`course: ${courseTitle} not found.`);
                return cb(null, null);
            }else{
                console.log(`course ${courseTitle} found.`);
                return cb(null, courses[0]);
            }
        });
    }
    //update course information
    updateCourse(courseId, course_title, start_date, course_duration, class_start_time, class_duration, location, description, cost){
        return new Promise((resolve, reject)=>{
            this.db.update({_id: `${courseId}`,},
                {$set:{'course_title': `${course_title}`,
                'start_date': `${start_date}`,
                'course_duration': `${course_duration}`,
                'class_start_time': `${class_start_time}`,
                'class_duration': `${class_duration}`,
                'location': `${location}`,
                'description': `${description}`,
                'cost': `${cost}`        
            }},{}, (err, doc)=>{
                if(err){
                    //error updating course
                    console.log('Error updating course', err);
                    reject(err);
                }else{
                    //update success
                    console.log('document updated', doc);
                    resolve(doc);
                }
            });
        });
    }
    //remove a course based on the course id
    remove(courseId){
        return new Promise((resolve, reject)=>{
            this.db.remove({_id: courseId}, {}, (err, docRemoved)=>{
                if(err){
                    //error deleting course
                    console.log('error deleting course');
                    reject(err);
                }else{
                    //course removed success
                    console.log('course removed: ', docRemoved);
                    resolve(docRemoved);
                }
            });
        });
    }
}
const dao = new CoursesDAO({filename: './data_store/danceCourses.db'});
// dao.init();
module.exports = dao;