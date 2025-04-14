const session = require('express-session');
const flash = require('connect-flash');

module.exports = (app) =>{
    //set session
    app.use(session({
        secret: process.env.SECRET_ACCESS_TOKEN,
        resave: false,
        saveUninitialized: true
    }));

    app.use(flash());

    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    });
}