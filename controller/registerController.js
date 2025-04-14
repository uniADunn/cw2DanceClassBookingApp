
const userModel = require('../models/userModel');

//gets the register view
exports.get_register = (req, res)=>{
    res.render('user/register', {
        title: 'Registration page'
    });
}
//registers new user
exports.post_register = (req, res)=>{
    //get data from form
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.pass;
    const role = 'USER'

    //check if user exists cb method
    userModel.lookup(username,(err, user)=>{
        if(err){
            //error looking up user
            console.log(`error looking up user: ${err.message}`);
            return res.status(500).redirect('user/register');
        }
        if(user){
            //username already taken
            console.log(`username already taken: ${username}`);
            return res.status(403).render('user/register',{
                title: 'Registration Page',
                formData: req.body,
                error_username: "username already taken",
                guest: true
                
            });
        }else{
            //register new user
            userModel.create(firstname, surname, email, username, password, role);
            console.log(`${username} registration successful`);
            //success - render login page
            return res.status(200).render('user/login',{
                title:'registration successful',
                guest: true
            });
        }
        
    });
    
}

