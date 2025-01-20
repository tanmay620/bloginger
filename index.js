const express=require('express')
const path=require('path')
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const mongoose=require('mongoose')
const cookieparser=require('cookie-parser')
const { checkforAuthCookie } = require('./middleware/authentication')
const blog = require('./modules/blog')

const app=express();
const port=8000;

mongoose.connect('mongodb://127.0.0.1:27017/bloginger').then(e=>console.log('MongoDb connected')).catch(e=>console.log('mongo db not connected error \n'+e));


app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkforAuthCookie('token'));
app.use(express.static(path.resolve('./public/')))


app.get('/',async (req,res)=>{
    const allblog=await blog.find({})
    console.log(allblog)
    return res.render('home',{
        user:req.user,
        blogs:allblog,
    })
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(port,()=>console.log("server started "))
