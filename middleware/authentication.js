const userModel = require('../models/userModel'); //user model
const bcrypt = require('bcrypt');//password encryption
const jwt = require('jsonwebtoken');//json webtoken module


exports.authenticateLogin = async (req, res, next)=>{
    //retrieve form data 
    var username = req.body.username;
    var password = req.body.pass;
    //look for user by username
    userModel.lookup(username, (err, user)=>{
        if(err){
            console.log(`error looking up user: ${err.message}`);
            return res.status(500).render('user/login', {
                title: 'login fail - error',
                guest: true
            });
        }
        if(!user){
            //user not found - route to register
            console.log('error: user not found');
            return res.status(404).render('user/register',{
                title: 'registration - user not found',
                error_user_notFound: 'Username not recognized - please register',
                guest: true
            });
        }
        //check password
        bcrypt.compare(password, user.password,(err, result)=>{
            if(result){
                //store info in payload
                let payload = {username: user.username, id: user._id, role:user.role};
                console.log('the payload: ', payload);
                //create json web token
                console.log('creating token');
                console.log(process.env.SECRET_ACCESS_TOKEN);
                let accessToken  = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN);
                res.cookie('jwt', accessToken,{httpOnly: true, secure: true, sameSite: "Strict", maxAge: 600000});
                console.log('token created');
                //add user details to request
                req.user = payload;
                //next - endpoint
                next();
            }else{
                // credentials are incorrect
                console.log('incorrect credentials');
                res.status(401).render('user/login',{
                    title: 'login page',
                    error_credentials: 'incorrect credentials',
                    formData: req.body    
                });                
            }
        });
    });
}
//verifies user cookie token
exports.verify = async (req, res, next)=>{
    console.log('Verifying user...');
    //get token
    let token = await req.cookies.jwt;
    console.log(token);
    //if there is no token
    if(!token){
        //user may be guest
        console.log('no token');
        //set user as null
        req.user = null;
        //next - middleware/endpoint
        return next();
    }
    try{
        //verify token
        const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        console.log('successfully verified.\n');
        //set user with payload details
        req.user = payload;
        next()
    }catch(e){
        //error verification failed - guest user mode
        console.log(`verification failed - guest user: `);
        req.user = null;
        next();
    }
}
// exports.isLoggedIn =(req, res, next)=>{
//     let accessToken = req.cookies.jwt;
//     if(!accessToken){
//         return false;
//     }else{
//         try{
//             const payload = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
//             req.user = payload;
//             return true;
//         }catch(e){
//             return false;
//         }
//     }
// }