const userModel = require('../model/user');
const blogPostModel = require('../model/blogPost');
const  commentModel = require('../model/comment');
const likesModel = require('../model/likes');
const likeCommentModel = require('../model/likeComments');
const dislikesModel = require('../model/dislikes');
const dislikeCommentModel = require('../model/dislikeComment');


// Post dislikes
let duplicateDislike = ""
module.exports = dislikes = async(req, res, next)=>{
  const{postID} = req.body;
  const user = req.session.user._id;
  // console.log(postID)

  let data = await dislikesModel.find({}).exec();
 if(!data){
   console.log("err");
 }
 if(data){ 
// loop though each data
data.forEach(dt => {
  if(dt.postID == postID && dt.user == user){
    duplicateDislike = "exist";
  }else if(dt.postID != postID && dt.user != user){
   duplicateDislike = "noExist";
  }
});
 }
 console.log(duplicateDislike);
  

    // Check if it is dulicated before posting
    if(duplicateDislike == "exist" || duplicateDislike != ""){
    res.redirect('back');
    console.log("Data exist ok");
    }else if(duplicateDislike == "noExist" || duplicateDislike == "" ){
    const aDislike = new dislikesModel({postID : postID, user:user });
      let data = await aDislike.save();
       if(!data){
           // console.log(err);
       }
       if(data){
         //  console.log(data)
        next();
       }
      
      console.log("Data does not exist");
      res.redirect('back');
      next();
   }
      
    }

// Post likes
let duplicateLike = ""
module.exports = likes = async(req, res, next)=>{
  const{postID} = req.body;
  const user = req.session.user._id;
  // console.log(postID)

  let data = await likesModel.find({}).exec();
 if(!data){
   console.log("err");
 }
 if(data){ 
// loop though each data
data.forEach(dt => {
  if(dt.postID == postID && dt.user == user){
    duplicateLike = "exist";
  }else if(dt.postID != postID && dt.user != user){
   duplicateLike = "noExist";
  }
});
next();
 }
 console.log(duplicateLike);
  

    // Check if it is dulicated before posting
    if(duplicateLike == "exist" || duplicateLike != ""){
    res.redirect('back');
    console.log("Data exist ok");
    }else if(duplicateLike == "noExist" || duplicateLike == "" ){
    const aLike = new likesModel({postID : postID, user:user });
      let data = await aLike.save();
       if(!data){
           console.log(!data);
       }
       if(data){
         //  console.log(data)
        
       }
      
      console.log("Data does not exist");
      res.redirect('back');
      
   }
      
    }
 


// get read all likes on post
module.exports = allLikes = async (req, res, next)=>{

  let docs = await likesModel.find({}).populate('user').populate('postID').exec();

  if(!docs){
    res.send({err:err})
    console.log(err)
}
if(docs){
     req.likes = docs
     next();
// console.log(docs);

}
  
  
}


// get read all dislikes on post
module.exports = allDislikes = async (req, res, next)=>{
 
  // read likes from database
  let docs = await dislikesModel.find({}).populate('user').populate('postID').exec();

  if(docs){
    req.dislikes = docs;
    next();
// console.log(docs);
}

}


// likeComment
let duplicateLikeComment = ""
module.exports = likeAComment = async(req, res, next)=>{
  const{ commentID, postID} = req.body;
  let user = req.session.user._id
   console.log("tHIS IS THE POST id" + postID);

 const aLike = new likeCommentModel({commentID:commentID,postID:postID, user :user }, (err, docs )=>{
     if(docs){
     console.log("Here are the data "  + docs)
     }
   });


 let data = await likeCommentModel.find({}).exec();
 if(!data){
   console.log("err");
 }
 if(data){ 
// loop though each data
data.forEach(dt => {
  if(dt.postID == postID && dt.user == user){
    duplicateLikeComment = "exist";
  }else if(dt.commentID != commentID && dt.user != user){
   duplicateLikeComment = "noExist";
  }
  next();
});
 }
 console.log(duplicateLikeComment);
  

    // Check if it is dulicated before posting
    if(duplicateLikeComment == "exist" || duplicateLikeComment != ""){
    res.redirect('back');
    console.log("Data exist ok");
    }else if(duplicateLikeComment == "noExist" || duplicateLikeComment == "" ){
    const aLike = new likeCommentModel({commentID : commentID, postID:postID, user:user });
      let data = await aLike.save();
       if(!data){
           // console.log(!data);
       }
       if(data){
          console.log(data)
        
       }
      
      console.log("Data does not exist");
      res.redirect('back');
      next();
   }
      
    }



  
// get read all likes on comments
module.exports = allLikeComments = async (req, res, next)=>{
 
  // read likes from database
  let docs = await likeCommentModel.find({}).populate('user').populate('commentID').exec();
      
      if(docs){
           req.likeComments = docs;
           next();
           // console.log(docs.length)
      }
  
}


 

// dislikeAComment
let dDislikeComment = ""
module.exports = dislikeAComment = async (req, res, next)=>{
  const{commentID, postID} = req.body;
  let user = req.session.user._id
  console.log(commentID)
 const aDislike = new dislikeCommentModel({commentID:commentID, postID:postID, user :user });

 let data = await dislikeCommentModel.find({}).exec();
 if(!data){
   console.log(!data);
 }
 if(data){ 
// loop though each data
data.forEach(dt => {
  if(dt.commentID == commentID && dt.user == user){
    dDislikeComment = "exist";
  }else if(dt.commentID != commentID && dt.user != user){
   dDislikeComment = "noExist";
  }

 });

 

    // Check if it is dulicated before posting
    if(dDislikeComment == "exist" || dDislikeComment != ""){
    res.redirect('back');
    console.log("Data exist ok");
    }else if(dDislikeComment == "noExist" || dDislikeComment == "" ){
    const aDislike = new dislikeCommentModel({commentID : commentID, postID:postID, user:user });
    aDislike.save((err, data)=>{
       if(err){
           // console.log(err);
       }
       if(data){
         //  console.log(data)
        
       }
      });
      console.log("Data does not exist");
      res.redirect('back');
      next();
   }
      
    }



// get read all dislikes on comments
module.exports = allDisLikeComments = async(req,res,next)=>{
  // read likes from database
  let docs = await dislikeCommentModel.find({}).populate('user').populate('commentID').exec();
      
      if(docs){
           req.dislikeComments = docs ;
           next();
      }

  
}



}