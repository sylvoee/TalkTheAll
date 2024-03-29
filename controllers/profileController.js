let userModel = require('../model/user');
let profileModel = require('../model/profile');


const mongoose= require('mongoose');



module.exports = function profile(req, res){
    res.render('profile', {aUser:req.session.user});
}

// get create profile
module.export = createProfileForm = async(req, res, next)=>{
  // console.log(req.session.user._id);
  let docs = await userModel.findById(req.session.user._id).exec();
  if(!docs){
console.log(!docs);
  }
  if(docs){
  res.render("createProfile", {aUser:req.session.user, docs:docs});
  // console.log(docs)
  }
  

}

// create profile
module.exports = createProfile = async(req, res, next)=>{
    // res.render('myProfile');
    const {DOB, place, person, maritalStatus, occupation, hobby, sex, info, purpose,institute, quote, issue,facebook, instagram} = req.body;
    if(occupation !='' & purpose != '', issue !=''){
      let profile = new profileModel({DOB, place, person, maritalStatus, occupation, hobby, sex, info, purpose, institute, 
        quote, issue,facebook, instagram, profileImage:'', user: req.session.user._id});
      let data = await profile.save();
        if(!data){
         console.log(!data);
        
        }
        if(data){
          // console.log(data);

      req.session.completeProfile = "completeProfile";
      res.render('user', {completeProfile:req.session.completeProfile})
      // console.log( req.session.completeProfile);
     
     
        }
    
      
    }

    res.redirect('/view-a-profile/'+ req.session.user._id);
    next();
  
  }

  // Update Userprofile complete status
  module.exports =  editCompleteProfileStatus = async (req, res, next)=>{
     // Updated User Model
     let edit = await userModel.findById(req.session.user._id);
     edit.profileStatus = "completed";

     try{
       edit = await edit.save();
         // res.redirect('/view-a-profile/'+ req.session.user._id); 
         // res.redirect('/all-blog-post');
         console.log("Edit profile completed")
     }
     catch(error){
          console.log(error);
     }
     
  }
  
  // read all Profiles
  module.exports = viewProfile  = async(req, res)=>{
    // res.send("route reached")
   
    // read all Profile
    let docs = profileModel.find({}).populate('user').populate('profile').exec();
      if(!docs){
          res.send({err:docs})
          // res.render('allComment', {err:docs});
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
    // get the Id from User Login
    let docs = await profileModel.find({"user": req.params.id}).populate('user').exec();
      if(!docs){
          console.log({err: !docs})
          // res.render('allComment', {err:err});
          console.log(!docs)
      }
      if(docs){
        if(typeof docs[0] !='undefined'){
          res.render('myProfile', {docs: docs, aUser:req.session.user, title:docs[0].user.name});
        }else{
          res.redirect('/get-create-profile');
        }
         
        
            // console.log(docs[0].user.name)
      
      }
  
  
  
  }
  
  // get edit profileForm
module.export = editProfileForm = async(req, res, next)=>{
  let docs = await profileModel.findById(req.params.id).populate('user').exec();
   if(!docs){
   console.log(!docs);
   }
     if(docs){
      res.render("editProfileForm", {docs:docs, aUser:req.session.user});
     }
  
 
 }
 
  
  // To Edit profile
  module.exports = editProfile  = async (req, res)=>{
    const{id} = req.body;
     // console.log(id);
  let edit = await profileModel.findById(id);
 
    edit.DOB = req.body.DOB;
    edit.place = req.body.place;
    edit.person = req.body.person;
    edit.maritalStatus = req.body.maritalStatus;
    edit.institute = req.body.institute;
    edit.occupation = req.body.occupation;
    edit.sex = req.body.sex;
    edit.hobby = req.body.hobby;
    edit.info = req.body.info;
    edit.purpose = req.body.purpose;
    edit.quote = req.body.quote;
    edit.issue = req.body.issue;
    edit.facebook = req.body.facebook;
    edit.instagram = req.body.instagram;
  
    try{
      edit = await edit.save();
        res.redirect('/view-a-profile/'+ req.session.user._id);
       
    }
    catch(error){
         console.log(error);
    }
  
  }

  
  // To Edit Profile Image
  // package for image upload
// const multer = require('multer');
// module.exports = upload =  multer({ dest: './public/uploads' })

module.exports = editProfileImage = async (req, res)=>{
    // console.log("Edit profile image reached ");
    let profilePicture = await profileModel.findById(req.params.id);
    // console.log(req.file);

    profilePicture.profileImage = req.file.filename;

    try{
        profilePicture = await profilePicture.save();
        res.redirect('/all-blog');
        console.log("Profile Pix edited")
    }
    catch(error){
         console.log(error);
    }


  }
  
  //
  module.exports = myProfile  =(req, res)=>{
    res.render('createProfile', {aUser:req.session.user});
  
  }
  
  
  