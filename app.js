//core modules
const path = require('path');

//3rd party modules
const express = require('express');
const cookieParser = require('cookie-parser');
const mustache = require('mustache-express');

require('dotenv').config();

//local 
var index = require('./routes/index');
var auth = require('./routes/auth');
const appAlert = require('./middleware/appAlert');
//app configuration
const port = process.env.PORT || 3000;
const app = express();

appAlert(app);
app.use(express.urlencoded({extended:false}));//parse encoded request body data
app.use(cookieParser());//parse cookies


//setup static file path
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

//setup mustache
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

//setup routes
app.use('/', index);
app.use('/auth', auth)

//server listen
app.listen(port ,()=>{
    console.log(`server started on port: ${port}\nPress ctrl^C to quit.`);
});