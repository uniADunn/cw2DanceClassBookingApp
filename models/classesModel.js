const nedb = require('gray-nedb');
//class model - database for dance classes, stores information like class name, start data, duration location etc...
class ClassesDAO{
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
            console.log('classes database created');
        }
    }
    //populate the database with classes
    init(){
        console.log('populating courses...');
        try{
            let classTitle = 'jazz course';
            let start_date = new Date().toISOString().split('T')[0];
            let start_time = 1200;
            let duration = 2
            let location = 'bellshill dance studio';
            let description = 'some descriptive text about the dance class.';
            let cost = 12.50;

            this.create(classTitle, start_date, start_time, duration, location, description, cost);
            this.create(classTitle, start_date, start_time, duration, location, description, cost);
            this.create(classTitle, start_date, start_time, duration, location, description, cost);
            this.create(classTitle, start_date, start_time, duration, location, description, cost);
            console.log(`class inserted: ${classTitle}`);
            console.log('poplating complete.');
        }catch(err){
            console.log(`Error: ${err.message}`);
        }

    }
    //create a class and insert into db
    create(class_title, start_date, start_time, duration, location, description, cost, cb){
        console.log(`creating new class: ${class_title}\nPlease wait...`);
        return new Promise((resolve, reject)=>{
            var entry = {
                class_title : class_title,
                start_date : start_date,
                start_time : start_time,
                duration : duration,
                location : location,
                description : description,
                cost : cost
            }
            this.db.insert(entry, (err)=>{
                if(err){
                    //error inserting class
                    console.log(`cant insert class: ${class_title}`);
                    reject(err);
                }else{
                    //insert successful
                    console.log(`class inserted: ${class_title}`);
                    resolve();
                }
            });
        });
        
    }
    //return a list of all the classes
    getAllClasses(){
        return new Promise((resolve, reject)=>{
            this.db.find({},(err, classes)=>{
                if(err){
                    //error getting classes
                    console.log(`Error getting all classes ${err.message}`);
                    reject(err);
                }else{
                    //resolve with the list of all classes
                    resolve(classes);
                }
            });
        });
    }
    //gets a specific class by the class id
    getClassById(class_id){
        return new Promise((resolve, reject)=>{
            this.db.find({'_id': class_id},(err, cls)=>{
                if(err){
                    //error getting a class
                    reject(err);
                }else{
                    //resolves with class
                    resolve(cls);
                }
            });
        });
    }
    //looks up a dance class with call back method
    lookup(danceClass, cb){
        console.log(`looking up dance class: ${danceClass}\nPlease wait...`);
        this.db.find({'class_title': danceClass}, (err, classes)=>{
            if(err){
                //error during lookup
                console.log(`error during class lookup: ${err.message}`);
                return cb(null, null);
            }
            //class not found
            if(classes.length == 0){
                console.log(`class: ${danceClass} not found.`);
                return cb(null, null);
            }else{
                //class found
                console.log(`class ${danceClass} found.`);
                return cb(null, classes[0]);
            }
        });
    }
    //updates an existing class 
    updateClass(classId, class_title, start_date, start_time, duration, location, description, cost){
        return new Promise((resolve, reject)=>{
            this.db.update({_id: `${classId}`,},
                {$set:{'class_title': `${class_title}`,
                'start_date': `${start_date}`,
                'start_time': `${start_time}`,
                'duration': `${duration}`,
                'location': `${location}`,
                'description': `${description}`,
                'cost': `${cost}`        
            }},{}, (err, doc)=>{
                if(err){
                    //error updating class
                    console.log('Error updating class', err);
                    reject(err);
                }else{
                    //update success
                    console.log('document updated', doc);
                    resolve(doc);
                }
            });
        });
    }
    //removes a class from the database using the class id
    remove(classId){
        return new Promise((resolve, reject)=>{
            this.db.remove({_id: classId}, {}, (err, docRemoved)=>{
                if(err){
                    //error removing class
                    console.log('error deleting class');
                    reject(err);
                }else{
                    //remove class success
                    console.log('class removed: ', docRemoved);
                    resolve(docRemoved);
                }
            });
        });
    }
}
const dao = new ClassesDAO({filename: './data_store/danceClass.db'});
// dao.init();

module.exports = dao;