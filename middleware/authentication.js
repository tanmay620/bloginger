const { validateToken } = require('../service/auth')

function checkforAuthCookie(cookieValue){
    return (req,res,next)=>{
        const token=req.cookies[cookieValue]
        if(!token){
            return next()
        }
        try{
            const userpayload=validateToken(token)
            req.user=userpayload
        }catch(error){}
        return next()
    }
}

module.exports={
    checkforAuthCookie,
}