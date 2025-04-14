const express = require('express');//express
const router = express.Router();//express router
const {validateRegistration} = require('../middleware/validateRegistration');//validates registration input middleware
//validates booking processes for guests and users
const {guestParticipantCheck, validateGuestBooking, guestCourseParticipantCheck} = require('../middleware/validateBooking');
const {verify} = require('../middleware/authentication');//verifies users
const registerController = require('../controller/registerController');//register controller - deals with registration processes
const danceController = require('../controller/danceController');//dance controller - deals with dance related processes
const indexController = require('../controller/indexController');//index controller - deals with privledge free processes
const {getClassDetails} = require('../middleware/getClassDetails');//gets class details middleware
const {getCourseDetails} = require('../middleware/getCourseDetails');//gets course details middleware
//verifies user, routes to index controller landing page end point
router.get('/', verify, indexController.landing_page);
//gets the about page
router.get('/aboutUs', indexController.aboutUs);
//verifies user is a guest, routes to index controller get register page end point
router.get('/register',verify, indexController.getRegister_page);
//validates registration input, routes to register controller post register end poin
router.post('/register', validateRegistration, registerController.post_register);
// verifies user is a guest, routes to index controller get login page end point
router.get('/login',verify, indexController.getLogin_page);
//verifies user is a guest or logged in, gets class details for listing and routes to dance controller show all classes end point
router.get('/show_all_classes', verify, getClassDetails, danceController.show_all_classes);
//verifies user is a guest or logged in, gets course details for listing and routes to dance controller show all courses end point
router.get('/show_all_courses', verify, getCourseDetails, danceController.show_all_courses);
//guest booking a class, validates guest input fields, checks participation , gets class details, routes to danc controller guest book class end point
router.post('/guest_book_class/:classId',validateGuestBooking, guestParticipantCheck, getClassDetails, danceController.guestBookClass);
//guest book course, validate guest booking input fields, checks guest participation in course, gets course details, routes to dance controller guest book course end point
router.post('/guest_book_course/:courseId', validateGuestBooking, guestCourseParticipantCheck, getCourseDetails, danceController.guestBookCourse);
module.exports = router;