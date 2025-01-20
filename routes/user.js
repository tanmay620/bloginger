const {Router}=require('express')
const User=require('../modules/user');

const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin");
})

router.get('/signup',(req,res)=>{
    return res.render("signup");
})

router.get('/singin',(req,res)=>{
    return res.render("singin")
})

router.post('/signup',async(req,res)=>{
    const { fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/')
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const token=await User.matchPassword(email,password)
    if(!token) return res.redirect('/user/signup')
    return res.cookie('token',token).redirect('/')
})

module.exports=router