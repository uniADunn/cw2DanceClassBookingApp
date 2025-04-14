const express = require('express');//express
const router = express.Router();//express router
const {validateLogin} = require('../middleware/validateLogin');//validate login middleware
const {authenticateLogin, verify} = require('../middleware/authentication');//authenticate login and verify middleware
const {participantCheck, courseParticipantCheck} = require('../middleware/validateBooking');//participant check and course participant check middleware
const {validateAdminRegistration} = require('../middleware/validateAdminRegistration');//validate admin registration middleware
const {validateNewClass} = require('../middleware/validateClass');//validate new class input
const loginController = require('../controller/loginController');//login controller - deals with login in and log out
const adminController = require('../controller/adminController');//admin controller - deals with administrative processes
const danceController = require('../controller/danceController');//dance controller - deals with dance related process such as class and course lists
const {getClassDetails} = require('../middleware/getClassDetails');//gets class details middleware
const {getParticipants} = require('../middleware/getParticipants');//gets participants middleware
const {removeParticipant} = require('../middleware/removeParticipant');//removes participants middleware
const {removeGuestParticipant} = require('../middleware/removeGuestParticipant');//removes guest participants middleware
const {validateNewCourse} = require('../middleware/validateCourse');//validates new course input
const {getCourseDetails} = require('../middleware/getCourseDetails');//gets course details middleware
const {getCourseParticipants} = require('../middleware/getCourseParticipants');//gets course participants middleware
const {removeCourseParticipant} = require('../middleware/removeCourseParticipant');//removes course participants middleware
const {removeGuestCourseParticipant} = require('../middleware/removeGuestCourseParticipant');//removes guest course participants middleware

//validates login fields, authenticates users login, process login at login controller routes to logged in index
router.post('/login', validateLogin, authenticateLogin, loginController.login);
//verifies user , performs logout on login controller routes to index as guest
router.get('/logout',verify, loginController.logout);
// verifies user is admin routes to admin control page
router.get('/admin', verify, adminController.admin_control_page);
//verifies if user is logged in or guest, checks if participant has booked, gets the class details routes to dance controller book class end point
router.post('/bookClass/:classId', verify, participantCheck, getClassDetails, danceController.bookClass);
//verifies if user is logged in or guest, checks if participant has booked, gets course details routes to dance controller book course end point
router.post('/bookCourse/:courseId', verify, courseParticipantCheck, getCourseDetails, danceController.bookCourse);
//verifies user before serving new admin registration form 
router.get('/newAdmin', verify, adminController.newAdminForm);
//verifies user berfore validating registration for admin form fields, routes to admin controller post new admin end point
router.post('/adminRegistration',verify, validateAdminRegistration,  adminController.postNewAdmin)
//verifies user berfore routing to admin controller delete admin end point
router.post('/deleteAdmin', verify, adminController.deleteAdmin);
//verifies user berfore routing to admin controller new class form end point
router.get('/addClass',verify, adminController.newClassForm)
//verifies user, berfore routing to new course form
router.get('/addCourse',verify, adminController.newCourseForm);
//verifies user before validating new class input fields, routes to dance controller add new class end point
router.post('/addNewClass',verify, validateNewClass, danceController.addNewClass);
//verifies user before validating course input fields, routes to dance controller add new course end point
router.post('/addNewCourse', verify, validateNewCourse, danceController.addNewCourse);
//verifies user, gets class details, routes to admin controller get edit classes list end point
router.get('/editClassesList',verify, getClassDetails,  adminController.getEditClassesList)
//verifies user, gets course details, routes to admin controller get edit courses list end point
router.get('/editCoursesList', verify, getCourseDetails, adminController.getEditCoursesList);
//verifies user, gets class details, routes to admin controller edit class form end point
router.get('/editClass/:classId', verify, getClassDetails, adminController.editClassForm);
//verifies user, gets course details, routes to admin controller edit course form
router.get('/editCourse/:courseId', verify, getCourseDetails, adminController.editCourseForm);
// verifies user, validates new class input fields, routes to dance controller post edit class end point
router.post('/postEditClass/:classId',  verify, validateNewClass, danceController.postEditClass);
//verifies user, validates new course input fields, routes to dance controller post edit course end point
router.post('/postEditCourse/:courseId', verify, validateNewCourse, danceController.postEditCourse);
//verifies user, routes to dance controller delete class end point
router.get('/deleteClass/:classId', verify, danceController.deleteClass);
//verifies user, routes to dance controller delete course end point
router.get('/deleteCourse/:courseId', verify, danceController.deleteCourse);
//verifies user, gets participants, routes to dance controller get class participants end point
router.get('/classParticipants/:classId', verify, getParticipants,  danceController.get_classParticipants);
//verifies user, removes participant from class, gets class details, gets participant, routes to dance controller remove participant from class
router.get('/removeUserClass/:userId/:classId', verify, removeParticipant, getClassDetails, getParticipants, danceController.removeParticipantFromClass)
//verifies user, removes guest participant form class, gets class details, gets participants, routees to dance controller remove guest participant from class
router.get('/removeGuestClass/:guestEmail/:classId', verify, removeGuestParticipant, getParticipants, danceController.removeGuestParticipantFromClass);
//verifies user, gets course participants, routes to dance controller get course participants end point
router.get('/courseParticipants/:courseId',  verify, getCourseParticipants, danceController.get_courseParticipants);
//verifies user, removes participant from course, gets course details, routes to dance controller remove participant from course
router.get('/removeUserCourse/:userId/:courseId', verify, removeCourseParticipant, getCourseDetails, danceController.removeParticipantFromCourse);
//verifies user, removes guest participant from course, gets course details, routes to dance controller, remove guest participant from course
router.get('/removeGuestCourse/:guestEmail/:courseId', verify, removeGuestCourseParticipant, getCourseDetails, danceController.removeGuestParticipantFromCourse);
module.exports = router;