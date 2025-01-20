const {Router}=require('express')
const multer=require('multer')
const path=require('path')
const Blog=require('../modules/blog');
const Comment = require('../modules/comment');

const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload/img/`))
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
      const fileName=`${Date.now()}-${file.originalname}`
      cb(null,fileName)
    }
  });
  const upload = multer({ storage: storage });

router.get('/add-new',(req,res)=>{
    return res.render('addblog',{
        user:req.user
    });
});

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.render(`/blog/${req.params.blogId}`)
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    return res.render("blog",{user:req.user,
        blog
    });
});

router.post('/add-new',upload.single('coverImage'),async (req,res)=>{
    const {title,body}=req.body;
    const blog=await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageUrl:`uploads/img/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});


module.exports=router