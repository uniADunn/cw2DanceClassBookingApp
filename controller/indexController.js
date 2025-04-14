//main home page determines if user is guest admin or user
exports.landing_page = (req, res)=>{
    //get user
    let user = req.user;
    //if not a user
    if(!user){
        //user is guest or not logged in
        res.status(200).render('index',{
            title: 'landing page',
            guest: true
        });
    }
    else{
        //user is logged in
        if(user.role == "ADMIN"){
            res.status(200).render('index',{
                title: 'Landin page - admin',
                admin: true
            });
        }
        else if(user.role == "USER"){
            res.status(200).render('index',{
                title: 'Landing page - user',
                user: true
            });
        }
    }    
}
exports.getRegister_page = (req, res)=>{
    //users are all guests until login
    res.status(200).render('user/register',{
        title: 'New registration',
        guest: true,
        admin:false,
        user: false
    });
}
exports.getLogin_page = (req, res)=>{
    //all users are guest before login
    res.status(200).render('user/login',{
        title: 'Login Page',
        guest: true,
        admin: false,
        user: false
    });
}
exports.aboutUs = (req, res)=>{
    res.status(200).redirect('about.html');
}
