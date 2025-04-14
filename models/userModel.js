const nedb = require('gray-nedb');
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS;
// user model - used to store user data and role 
class UserDAO {
    constructor(dbFilePath){
        //embedded
        if(dbFilePath){
            this.db =  new nedb({
                filename: dbFilePath.filename,
                autoload: true
            });
            console.log(`database connected to: ${dbFilePath.filename}`);
        }else{
            //in memory
            this.db = new nedb();
            console.log(`user database created`);
        }        
    }
    //populated users and added admin role
    init(){
        console.log(`populating users...`);
        try{
            let fname = 'Ashley';
            let lname = 'Dunn';
            let email = "adunn300@caledonian.ac.uk"
            let uname = "kruel"
            let password = 'password';
            let role = 'ADMIN';
            
            // create admin
            this.create(fname, lname, email, uname, password, role);

            // let fname1 = 'Bob';
            // let lname1 = 'Human';
            // let email1 = "bHuman300@caledonian.ac.uk";
            // let uname1 = 'Bobby98';
            // let password1 = 'password1';
            // let role1 = 'USER'
            
            //create user
            // this.create(fname1, lname1, email1, uname1, password1, role1);
            // console.log('Populating users complete.');

        }catch(e){
            console.log('Error populating users');
        }
    }
    //creates new users
    create(firstname, surname, email, username, password, role){
        console.log(`creating user: ${username}...`);

        return new Promise((resolve, reject)=>{
            bcrypt.hash(password, saltRounds).then((hash)=>{
                var entry = {
                    firstname: firstname,
                    surname: surname,
                    email: email,
                    username: username,
                    password: hash,
                    role: role
                }
                //inserts users to db
                this.db.insert(entry, (err, doc)=>{
                    if(err){
                        //error inserting user
                        console.log(`cant insert user: ${username}.`);
                        reject(err);
                    }else{
                        //user inserted success
                        console.log(`user inserted: ${username}`);
                        resolve(doc);
                    }
                });
            });

        });
    }
    //looks up users using call back method
    lookup(user, cb){
        console.log(`looking up user: ${user}...`);
        this.db.find({'username': user}, (err, users)=>{
            if(err){
                //error during look up
                console.log(`error during user lookup: ${err.message}`);                
                return cb(null, null);
            }
            //no user found
            if(users.length == 0){
                console.log(`user: ${user} not found.`);                
                return cb(null, null);
            }else{
                //user found
                console.log(`user ${user} found.`);                
                return cb(null, users[0]);
            }                        
        });
    }
    //get a user by user id
    getUserById(userId){
        return new Promise((resolve, reject)=>{
            this.db.findOne({'_id': userId}, (err, user)=>{
                if(err){
                    //error finding user
                    console.log('error getting user by id');
                    reject(err);
                }else{
                    //user found
                    console.log('user retrieved');
                    resolve(user);
                }
            });
        });        
    }
    //removes an admin user
    removeAdmin(adminUsername){
        return new Promise((resolve, reject)=>{
            this.lookup(adminUsername, (err, user)=>{
                if(err){
                    //error during lookup
                    console.log('error during lookup')
                }else{
                    //user not found
                    if(user == null || user === undefined){
                        console.log('user not found');
                        reject(new Error('User not found'));
                    }else{
                        //user found
                        console.log('user found... preparing to delete...');
                        //checking user is an admin before delete
                        if(user.role !== 'ADMIN'){
                            //user is not admin - stop delete
                            console.log('user is not admin');
                            reject(new Error('Action not allowed, user is not admin'));
                        }else{
                            //user is an admin 
                            this.db.remove({'_id': user._id}, (err)=>{
                                if(err){
                                    //error removing admin
                                    console.log('error deleting user');
                                    reject(err);
                                }
                                else{
                                    //admin deleted
                                    console.log('admin user deleted');
                                    resolve(user);
                                }
                            });
                        }
                        
                    }
                }
            });
        });
    }
}

const dao = new UserDAO({filename: './data_store/user.db', autoload: true});
// dao.init();
module.exports = dao;