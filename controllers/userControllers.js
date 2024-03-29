

const userModel = require('../model/user');
// hash passwrod variables
const bcrypt = require('bcrypt');
const { getMaxListeners } = require('../model/user');
const profileModel = require('../model/profile');
const saltRounds = 10;


// set Login
let setLogin;
let setAdminLogin;
// reset Id
let  resetId ;

// check login function
module.export = checkLogin = (req, res, next)=>{
    if(setLogin == true){
        next();
    }else if(setLogin == false){
        res.render('index');
    }
} 


// page not allow when login
module.exports = notAllowedWhenLogin = (req, res, next)=>{
  if(setLogin == false){
    next();
  }else{
    res.redirect('/unauthorised');
  }
}

    // send mail
    var nodemailer = require('nodemailer');
const { render } = require('ejs');
     let sendMail = (receiver, subject, HTMLmsg)=>{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: receiver,
            subject: subject,
            html: HTMLmsg
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
     }

// get sign up controller
module.exports = signUp = (req, res)=>{
     res.render('signUp', {title: "talkTheAll-Register"});
 }

 // post signUp
 let Users = [];
 module.exports = signUp = async(req, res)=>{
    const {name, email, password, confirmPassword} = req.body;
    let errors = [];
 // check for undefined
 if(typeof name == 'undefined' || typeof email == 'undefined' || typeof confirmPassword == 'undefined'){
     //errors.push({msg: "Fields are undefied"});
    console.log(errors)
}


    // to check if it is empty
    if(!name || !email || !confirmPassword ){
        errors.push({msg : "You can not submit an empty field"});
        console.log(errors)
    }
   

    // check if password matches
    if(password !== confirmPassword){
        errors.push({msg: "Password does not match"});
        console.log(errors)

    }
     
     
    if(errors.length > 0){
       res.render('signUp', {errors:errors});
       console.log("Not successful")
    }else{
         userModel.findOne({email : email}).exec((err, data) =>{
         if(data){
            res.render('signUp' , {msg: email + " already exist"});
            console.log(email + " already exist");
         }else{
              // making instance of model
           let instance = new userModel();
           instance.name = name;
           instance.email = email;
           instance.password = password;
           instance.status = email;
          
           // hash password before saving ok
           bcrypt.genSalt(saltRounds, function(err, salt) {
             bcrypt.hash(instance.password, salt, function(err, hash) {
             instance.password = hash;

               // Saving record
           let data = instance.save();
             if(!data){
               res.render('signUp', {msg: !data});
             }else if(data){
               // req.flash('success_msg', "You have successfully sign up, you can now log in");
               res.redirect('/login');
               Users.push(data);
             req.session.user = data;
             // console.log(Users)

            //    sending mail
            sendMail(email, 'WELCOME TO talkTheAll', '<div><h1>talkTheAll</h1><p>Thanks for signing up with talkTheAll . Please click <a href = "https://talktheall.com.ng/login"><b>HERE</b></a> to login</p></div>');

             }
           
           
             }); 
           });

         }
         })
        
 
    }

}


// get login
module.exports = login = (req, res)=>{
    res.render('login');
   
}

// post login controller
module.exports = login = async (req, res)=>{
    // res.send('login reached');
    const{email, password, status} = req.body;
    
    if(status == 'osaz@forum'){
      let data = await userModel.findOne({email, status: 'osaz@forum'}).exec();
        if(data != null || data ){ 
            bcrypt.compare(password, data.password, (err, isMatch)=>{
                if(isMatch){
                   setLogin = true;
                    req.session.user = data;
                    // console.log(req.session);
                    res.render('admin-dashboard', {aUser :req.session.user});
                    console.log("setLogin is " + setLogin);
                }else{
                    res.render('login-admin', {msg: "email or/and password does not exist"});
                           console.log("email or/and password does not exist");
                }
            })
            
        }
      
      else if(!data || email == ''|| password == ''){
          res.render('login', {msg: "email or/and password does not exist"});
          console.log("Email or/and password does not exist");
        }

    
    
    }
    
   if(status != 'osaz@forum'){
    let data = await userModel.findOne({email}).exec() ;
    
  
      if(data != null || data ){ 
          bcrypt.compare(password, data.password, (err, isMatch)=>{
              if(isMatch){
                 setAdminLogin = true;
                  req.session.user = data;
                  res.render('user', {data :req.session.user, aUser:req.session.user});
                  console.log("setAdminLogin is " + setAdminLogin);
              }else{
                  res.render('login', {msg: "email or/and password does not exist"});
                         console.log("email or/and password does not exist");
              }
          })
          
      }
    
    else if(!data || email == ''|| password == ''){
        res.render('login', {msg: "email or/and password does not exist"});
        console.log("Email or/and password does not exist");
      }


   }
    
}

// logout controller
module.exports = signOut = (req, res)=>{
     req.session.destroy(()=>{
      res.cookie({maxAge: 0});
         res.redirect('/');
         setLogin = false

         console.log("Login is " + setLogin);
     });
    
     
 }

 // dashboard controller
 module.exports = dashboard = (req, res)=> {
    res.render('user');
    
}

// Admin dashboard controller
module.exports = adminDashboard = (req, res)=> {
  res.render('admin-Dashboard', {aUser: req.session.user});
  
}
// Login Admin controller
module.exports = loginAdmin = (req, res)=> {
  res.render('login-admin');
  
}



// Get confirm Email
module.exports = confirmEmail = (req, res)=>{
    if(req.session.user){
        res.render('user');
    }else{
    res.render('confirmEmail');

    }

    res.render('confirmEmail');
     
}
//  const sendRestID
// Post confirm password
module.exports = confirmEmail = async(req, res)=>{
    const {email} = req.body
    
     let match = await userModel.findOne({email:email}).exec();
        if(match){
            if(email !=''){
               let id = match.id;
               resetId = id
             
              const link = 'https://talktheall.com.ng/change-password';
               // console.log(resetId)
sendMail(email, 'CHANGE PASSWORD / FORGET  PASSWORD', '<div><h2>talkTheAll</h2><form action="https:https://talktheall.com.ng/reset-id" method = "POST"><input type="hidden" value="'+ resetId + '" name="test"><button class= "btn btn-info">Click To Reset</button></form></div> ');
                res.redirect('/');
                console.log("mail sent successfully")
            }
        }else{
            res.render('confirmEmail', {msg: "Email not found"});
            console.log(" Email Not found")
        }

 
     
   
 }

 // reset Id
 module.exports = getId = (req, res)=>{
  const{test}= req.body;
  res.render('changePassword', {resetId : test, title:"talkTheAll - Password Reset"});
 
}
 

 // Get Change Password
 module.exports = changePassword =(req, res)=>{
     console.log("Change password route reached")
     res.render('changePassword', { resetId :  resetId, title:"talkTheAll - Password Reset"});
 }

 //update forget password controller
  module.exports = changePassword = async (req, res)=>{
    // console.log(req.body.resetId);
    // console.log(req.body);

    let changepass = await userModel.findById(req.body.resetId);
    if(req.body.password == req.body.confirmPassword){

      changepass.password =  bcrypt.hashSync(req.body.password, saltRounds);;
  
      try{
          changepass = await changepass.save();
          // console.log(req.body.password)
          res.redirect('/login');
          console.log("Password sucessfull change")
      }
      catch(error){
           console.log(error);
      }
      
    }else{
      console.log("Password does not match ok")
      res.render('signUp');
    }
   
}

// Get unauthorised
module.exports = unauthorised = (req, res)=>{
  res.render('unauthorised');

}

// create profile
module.exports = createProfile =async(req, res)=>{
  res.render('myProfile');
  const {DOB, place, person, maritalStatus, occupation, hobby, info, purpose,institute, quote, issue,facebook, instagram} = req.body;
  if(occupation !='' & purpose != '', issue !=''){
    let profile = new profileModel({DOB, place, person, maritalStatus, occupation, 
    hobby, info, purpose, institute, quote, issue,facebook, instagram, user: aUser._id});

    let data = await profile.save();
      if(error){
       console.log(error);
      }
      if(data){
        // console.log(data)
        res.redirect('/my-profile');
      }
    
    
  }

}

// read all Profiles
module.exports = viewProfile  = async(req, res)=>{
  // res.send("route reached")
 
  // read all Profile
  let docs = await profileModel.find({}).populate('user').exec();
    if(!docs){
        console.log(!docs)
    }
    if(docs){
        res.render('index', {docs: docs});
        // console.log(docs);
  
    }



}

 //read a Profile
 module.exports = viewAProfile  = async(req, res)=>{
 
  // read all Profile
  let docs = profileModel.find({"user": req.params.id}).populate('user').exec();
    if(!docs){
        res.send({err:!docs})
        // res.render('allComment', {err:err});
        console.log(!docs)
    }
    if(docs){
        res.render('myProfile', {docs: docs});
      
         // console.log(docs)
    
    }



}


// To Edit profile
module.exports = editProfile  = async (req, res)=>{

  let editProfile = await profileModel.findById(req.params.id);

  editProfile.DOB = req.body.DOB;
  editProfile.place = req.body.place;
  editProfile.person = req.body.person;
  editProfile.maritalStatus = req.body.maritalStatus;
  editProfile.institute = req.body.institute;
  editProfile.occupation = req.body.occupation;
  editProfile.hobby = req.body.hobby;
  editProfile.info = req.body.info;
  editProfile.purpose = req.body.purpose;
  editProfile.quote = req.body.quote;
  editProfile.issue = req.body.issue;
  editProfile.facebook = req.body.facebook;
  editProfile.instagram = req.body.instagram;

  try{
    editProfile = await editProfile.save();
      res.redirect('/');
      console.log("sucessfully edited")
  }
  catch(error){
       console.log(error);
  }


}




module.exports = myProfile  =(req, res)=>{
  res.render('createProfile');

}


// get - read all user (moderator)
module.exports = moderator = async(req, res, next)=>{
  let data = await userModel.find({}).exec();
if(!data){
  console.log(!data)
}
if(data){
  res.render('moderator', {data:data , aUser: req.session.user, title:"Moderator"});
  // console.log(data);
}
  
 
}



// delete user and it profile
// module.exports = deleteUserProfile = (req, res, next)=>{

// const{userId} = req.body;
// console.log("thisis the user id that was deleted " + userId)
// userModel.findOneAndDelete(userId, (err, data)=>{
//   if(err){
// console.log(err);
//   }
//   if(data){
// console.log("User deleted")
//   }
// });

// // delete Userprofile
// profileModel.findOneAndDelete(userId, (err, data)=>{
//   if(err){
// console.log(err);
//   }
//   if(data){
// console.log("profile  deleted")
//   }
//   res.redirect('back');
// });


// }

// module.exports = moderator = (req, res, next)=>{
//   res.render('moderator');
//   }




