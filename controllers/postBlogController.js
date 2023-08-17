const userModel = require('../model/user');
const postBlogModel = require('../model/blogPost');
const likesModel = require('../model/likes');
const commentModel = require('../model/comment');
const dislikesModel = require('../model/dislikes');
const likeCommentModel  = require('../model/likeComments');
const dislikeCommentModel = require('../model/dislikeComment');
const commentCommentModel = require('../model/commentComment');


// package for image upload
const multer = require('multer');
module.exports = upload =  multer({ dest: './public/uploads' })

// delete image from post function
function deleteImage(){
    const fs = require('fs');
    const path = './public/uploads/'+ imageName; 

    try {
    fs.unlinkSync(path)
   console.log("file removed");
    } catch(err) {
    console.error(err)
    }
}

// Get blogPost
module.exports = postBlog = (req, res)=>{
    // res.render('blog');
    res.render('post-blog', {aUser:req.session.user, title:"Create Blog"})
   // console.log("A just Post a Record " + req.session.user)
   
  }

  
  // post postBlog
module.exports = postBlog = async(req, res)=>{
    if(typeof req.body != 'undefined'){
    const {category, commentStatus, title, image , blog} = req.body;
    // console.log("From image " + req.file.filename);
var myPost = {
    category, commentStatus ,title, blog, 
     image: req.file, 
     user: req.session.user._id,   
}
    postBlog = new postBlogModel(myPost);

    // saving blog
    if(typeof title != "undefined" || typeof blog != 'undefined'){
       let data = await postBlog.save() ;
            if(!data){
                res.render('post-blog', {error: !data});
           
            // res.send(error);
             console.log({error :!docs});
     
            }
            if(data){
            //   res.send("post has been succesfully made");
             res.render('post-blog', {aUser: req.session.user});
             //console.log({msg: "post has been made successfully"});

            }
            
         
    }else{
        res.render('post-blog', {aUser: req.session.user});
    }
        
    }
   
}

// get read all blog Admin
module.exports = allBlog = async(req,res)=>{
    // read from database
    let data = await postBlogModel.find({}).sort({createdAt: -1}).populate('user', 'comments').exec();
        if(!data){
            // res.render('allBlogs', {error:error});
            res.render('allBlogs', {error: !data});
            console.log(!data);
        }
        if(data){
    res.render('allBlogs', {data: data, comment:req.comment, aUser:req.session.user, title:"Edit Blog"});
        
        }

    
}




// get read all blog
// module.exports = allBlogPost = async (req, res, next)=>{

//     // read from database

//      await postBlogModel.find({}).sort({createdAt: -1}).populate('user').then((data)=>{
//           let docs =  data
//           res.render('allBlogPost', {data:docs, comments: req.comments, aUser:req.session.user, title:"All Blog Post"});
//      });

   
// }




// get read all blog
module.exports =allBlogPost = async (req,res)=>{
    // read from database
    let data = await postBlogModel.find({}).populate('user').exec();
        if(!data){
           
            // res.render('allBlogs', {error:error});
            res.render('allBlogs', {error:!data});
            console.log(!data)
        }
        if(data){
             let docs =  data ;
   res.render('allBlogPost', {data:docs, comments: req.comments, aUser:req.session.user, title:"All Blog Post"});
        
        }

   
}


// trending articles
module.exports = trendingArticles = async (req,res, next)=>{
    // read from database
    let data = await postBlogModel.find({}).populate('user').exec();
    if(data){
        req.trendingArticles  = data;
       // console.log(req.trendingArticles);
    next();
         
        }else{
            res.render('allBlogs', {error:!data});
            console.log(error) 
        }


}



// deleting a post
module.exports = deletePost = async(req, res)=>{
    const{id, imageName, commentID} = req.body;
    let success = await postBlogModel.findByIdAndDelete({_id:id}) ;
        if(!success){
         console.log(!success);
        }
        if(success){
        console.log("post deleted");
        }

    

    // delete image from post function

    const fs = require('fs');
    const path = './public/uploads/'+ imageName; 
    try {
    fs.unlinkSync(path)
   // console.log("file removed");
    } catch(err) {
    console.error(err)
    }


    // Delete comment
    success = await commentModel.deleteMany({postID:id});
        if(!success){
         res.send(!success);
         console.log(!success);
        }
        if(success){
        // res.render('deleteComment', {msg:"Post has been sucessfully deleted"})
        console.log("comment deleted");


    // Delete comment on comment
    success = await commentCommentModel.deleteMany({postID:id})
        if(!success){
         console.log(!success);
        }
        if(success){
           console.log({msg:"Comment Comment has been sucessfully deleted"});
        }

    

    // Delete likes
     success = await likeCommentModel.deleteMany({postID:id});
        if(!success){
         console.log(!success);
        }
        if(success){
         console.log({msg:"like Comment has been sucessfully deleted"});
        }


    // Delete disikes on comment
    success = await dislikeCommentModel.deleteMany({postID:id}) ;
         
        if(success){
        console.log({msg:"Dislike Comment has been sucessfully deleted " });
        }

        }

    


// Delete likes on post
    success = likesModel.deleteMany({postID:id})
        if(!success){
         console.log(!success);
        }
        if(success){
        // res.render('deleteComment', {msg:"Post has been sucessfully deleted"});
        console.log("comment deleted");
        }
    

    // Delete dislike post
    success = await dislikesModel.deleteMany({postID:id})
        if(!success){
         console.log(!success);
        }
        if(success){
           //console.log({msg:"Comment Comment has been sucessfully deleted"});
           console.log("Dislikes on post deleted");
        }

    // Delete comment on comment
 res.redirect('back');
//  res.send("Success")

}

// Get Edit Post
module.exports = editPost = async (req, res)=>{
    let data = await postBlogModel.findById({"_id": req.params.id}).exec() ;
        if(!data){
             res.render('editPost', {error :!data});
             console.log(!data)
        }
        if(data){
            res.render('editPost', {data:data, aUser:req.session.user});
             console.log("Edit post Form");
        }
    
}

// To Edit post
module.exports = editPosts = async (req, res)=>{

    let blog = await postBlogModel.findById(req.params.id);
   
    blog.title = req.body.title;
    blog.category = req.body.category;
    // blog.image = req.file;
    blog.blog = req.body.blog;

    try{
        blog = await blog.save();
        res.redirect('/all-blog');
        console.log("sucessfully edited");
         // console.log(req.file);
    }
    catch(error){
         console.log(error);
    }


  }

  // view a post
  module.exports = viewAPost = async (req, res)=>{
     
    postBlogModel.findById({_id: req.params.id}).populate('user').then((data)=>{
     let aPost = data;
     
     res.render('aPost',
     {  aPost: aPost,
        trendingArticles: req.trendingArticles,
        comments: req.comments,
        likes: req.likes, 
        dislikes: req.dislikes,
        likeComments: req.likeComments,
        dislikeComments: req.dislikeComments,
        commentComment: req.commentComment,
        aUser:req.session.user,
        title:aPost.title
});
    });

    
    }


