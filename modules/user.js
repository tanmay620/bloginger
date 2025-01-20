const {Schema,model}=require('mongoose')
const {createHmac,randomBytes} =require("node:crypto")
const {createTokenForUser,}=require('../service/auth')

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    salt:{
        type:String,
        //   required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:'/public/img/person.svg'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    }
},{timestamps:true})

userSchema.pre("save",function(next){
    const user=this
    console.log("enterd schema pre phase")
    if(!user.isModified("password")) return ;

    const salt=randomBytes(16).toString()
    const hashedpassword=createHmac("sha256",salt).update(user.password).digest('hex')

    this.salt=salt
    this.password=hashedpassword
    return next()
})

userSchema.static('matchPassword',async function(email,password){
    const user =await this.findOne({email})
    if(!user) return false;
    const salt=user.salt
    const hashedpassword=user.password

    const  userProvideHassed=createHmac("sha256",salt).update(password).digest('hex')
    if (!(userProvideHassed===hashedpassword)) {
        return false
    }
    const token = createTokenForUser(user);
    console.log("match password")
    return token;
    //return {...user,password:undefined,salt:undefined }
})

const user=model('user',userSchema)

module.exports=user