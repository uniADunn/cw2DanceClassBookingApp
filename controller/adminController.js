
const userModel = require('../models/userModel'); //user model
const classModel = require('../models/classesModel'); //class model
const courseModel = require('../models/coursesModel'); //course model

//gets admin control page if user is admin else redirects to login page
exports.admin_control_page = (req, res)=>{
    //get user details
    const user = req.user;
    //get users role
    const role = user.role
    console.log('Admin Role: ', role);
    //check user role is admin
    if(role == 'ADMIN'){
        //render admin control page
        res.render('admin/controlPage',{
            title : 'admin control',
            admin: user            
        })
    }else{
        //role is not admin
        res.status(401).redirect('user/login');
    }
    
}
//gets form to register a new admin
exports.newAdminForm = (req, res)=>{
    //get user details
    const user = req.user;
    //get current users username
    const username = user.username;
    //get user role
    const role = user.role;
    console.log(`username: ${username}\nRole: ${role}`);
    //check user role is admin
    if(role == 'ADMIN'){
        //is admin user - render registration form 
        res.render('admin/addAdminForm',{
            title: 'new administrator',
            admin: req.user
        });
    }else{
        //is not admin user - redirect to login page
        console.log(`user not authorised`);
        res.status(401).redirect('user/login',{
            title: 'unauthorized access error - please login'
        });
    }
}
// registers a new administrator
exports.postNewAdmin = (req, res)=>{
    //get form details
    let fname = req.body.firstname;
    let lname = req.body.surname;
    let email = req.body.email;
    let uname = req.body.username;
    let password = req.body.pass;
    //set role as admin
    let role = 'ADMIN';
    try{
        //add new admin to user model
        userModel.create(fname, lname,email, uname, password, role);
        //success - render admin control page
        res.render('admin/controlpage', {
            title: 'admin control page',
            admin: req.user,
            success: `Admin user: ${uname} successfully registered`
        });        
    }catch(e){
        //error adding new admin
        console.log('error', e.message);
        //route user to admin form 
        res.status(500).render('admin/addAdminForm',{
            title: 'error: internal server error',
            formData: req.body,
            admin : req.user
        });
    }
}
//deletes admin based on username
exports.deleteAdmin = (req, res)=>{
    //get admin username to be deleted from form
    let adminUname = req.body.adminUname;
    console.log(`Deleting admin user: ${adminUname}`);
    console.log(`current user: ${req.user.username}`);
    //check form name is not current user
    if(adminUname !== req.user.username){
        //is not current user name - proceed with delete
        userModel.removeAdmin(adminUname)
        .then((deletedUser)=>{
            //admin not found
            if(!deletedUser){
                return res.status(404).render('admin/controlPage',{
                    title: 'Delete error - admin',
                    admin: req.user,
                    fbMsg_fail: `admin ${adminUname} not found`
                });
            }else{
                //delete successful
                console.log('delete successful');
                res.status(200).render('admin/controlPage',{
                    title: 'delete success - admin',
                    admin: req.user,
                    success: `Delete Success: ${adminUname} removed successfully`
                });
            }
        }).catch(err =>{
            //error deleting admin
            console.log(`Error during delete: ${err.message}`);
            res.status(500).render('admin/controlPage',{
                title: 'Delete Error - admin',
                fbMsg_fail: `Delete Failed: ${err.message}`,
                admin: req.user 
            });
        });
    }else{
        //cant delete yourself
        res.status(403).render('admin/controlPage',{
            title: 'delete error',
            admin: req.user,
            fbMsg_fail: `Delete Error: Can't delete yourself: ${adminUname}`
        });
    }
}
//gets a new class form
exports.newClassForm = (req, res)=>{
    //set min date - not functioning properly!
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() +1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    //set form validation attributes
    const minTime = '08:00';
    const maxTime = '22:00';
    const stepTime = '300';
    const formData = {startTime: "08:00"};
    //render new class form
    res.render('admin/newClassForm',{
        title: 'new dance class form - admin',
        admin: req.user,
        minDate: minDate,
        minTime: minTime,
        maxTime: maxTime,
        stepTime: stepTime,
        formData: formData        
    });
}
//gets the edit class list page
exports.getEditClassesList = async (req, res)=>{
    //get user details
    let user = req.user;
    //get class data
    let classData = req.classData;
    console.log('class Data: for edit classes list', classData);

    try{
        //render class list edit view
        
        res.status(200).render('admin/editClassesList',{
            title: 'Edit/remove classes - admin',
            admin: user,
            classDetails: classData.classDetails,
            
        });
    }catch(err){
        //error getting the classes
        console.log('error getting classes list - admin');
        res.status(500).render('admin/controlPage', {
            title: 'error getting class list - admin',
            admin: user,
            fbMsg_fail: 'Error getting class list'
        })
    }
}
// 
exports.getEditCoursesList = async (req, res)=>{
    //get user details
    let user = req.user;
    //get course data
    let courseData = req.courseData;
    console.log('course data: for edit courses list', courseData);
    try{
        //render admin view of courses list - edit/delete and view participant buttons
        res.status(200).render('admin/editCoursesList',{
            title: 'Course Mangement - admin',
            admin: user,
            courseDetails: courseData.courseDetails
        });
    }catch(err){
        //error getting course list
        console.log('error getting courses list for management - admin');
        res.status(500).render('admin/controlPage', {
            title: 'error getting course list for management -admin',
            admin: user,
            fbMsg_fail: 'error getting course list for management'
        })
    }
}
// edit class details form
exports.editClassForm = (req, res)=>{
    //get class id from parameter
    const classId = req.params.classId;
    console.log(`class id ${classId}`);
    //get the class from model
    try{
        //format cost to 2 decimal places
        classModel.getClassById(classId).then((cls)=>{
            //iterate through class details
            cls = cls.map(editClass=>{
                //return all information as is, only change the number column data in cls
                return {...editClass, cost:Number(editClass.cost).toFixed(2)}
            });
            console.log("class cls: ", cls)
            console.log("user", req.user);
            //check the length of cls
            if(cls.length == 0){
                //cls is empty - class not found
                console.log(`class not found`);
                res.status(404).render('admin/controlPage',{
                    title: 'class not found',
                    admin: req.user,
                    fbMsg_fail: 'class not found'
                });
            }else{
                //got class render form with current class details
                res.status(200).render('admin/editClassForm',{
                    title: `edit class - ${cls[0].class_title}`,
                    classes: cls,
                    admin: req.user,
                });
            }
        });
    }catch(err){
        //error getting class details for editing form        
        console.log('error editing class');
        res.status(500).render('admin/controlPage', {
            title: 'error: internal server error',
            admin: user,
            fbMsg_fail: 'Error getting class details'
        });        
    }
}
//get edit course form
exports.editCourseForm = (req, res)=>{
    //get course id from parameter
    const courseId = req.params.courseId;
    try{
        //get course with course id
        courseModel.getCourseById(courseId).then((course)=>{
            //iterate through the course details
            course = course.map(editCourse=>{
                //return all data from as is, edit cost only to 2 decimal places
                return {...editCourse, cost:Number(editCourse.cost).toFixed(2)}
            });
            //got course details- render course editing form
            res.status(200).render('admin/editCourseForm',{
                title: `edit course - ${course[0].course_title}`,
                courseDetails: course,
                admin: req.user,
            });
        });
    }catch(err){
        //error getting course details for editing form 
        console.log('error editing course: ', err.message);
        res.status(500).render('admin/controlPage',{
            title: 'error getting course details',
            admin: req.user,
            fbMsg_fail: 'error getting course details'
        });        
    }
}
//get new course form
exports.newCourseForm = (req, res)=>{
    // set min date - not working properly
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() +1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    //set validation attributes
    const minTime = '08:00';
    const maxTime = '22:00';
    const stepTime = '300';
    const formData = {startTime: "08:00"};
    //render new course form
    res.status(200).render('admin/newCourseForm',{
        title: 'new dance course form - admin',
        admin: req.user,
        minDate: minDate,
        minTime: minTime,
        maxTime: maxTime,
        stepTime: stepTime,
        formData: formData        
    });
}