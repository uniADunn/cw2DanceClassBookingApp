const userModel = require('../models/userModel'); //user model

// performs login process
exports.login = (req, res)=>{
    const username = req.body.username;
    const password = req.body.pass;
    const role = req.user.role;
    console.log('role:', role)
    //check if user exists
    userModel.lookup(username, (err, user)=>{
        if(err){
            console.log(`error looking up user: ${err.message}`);
            return res.status(500).redirect('/index/login');
        }
        if(!user){
            return res.status(404).render('/index/login', {
                title: 'Login page'
            });
        }else{
            if(role == 'USER'){
                //go to user landing page
                console.log('role:', role);
                res.status(200).render('index', {
                    title: 'logged in user',
                    user: user
                });
            }
            if(role == 'ADMIN'){
                //GO TO ADMIN CONTROL PAGE
                console.log('i am a admin user');
                console.log('role', role);
                res.status(200).render('index',{
                    title: 'admin logged in',
                    admin: user
                })
            }
            //instructor check for login - future development
        }

    });
}
//perfoms logout 
exports.logout = (req, res)=>{
    console.log('logging out...');
    //clear cookie
    res.clearCookie('jwt').status(200).render('index',{
        title: 'logged out',
        guest: true
    });
    console.log('logged out');
}