const jwt=require('jsonwebtoken')
require('dotenv').config()

const secret= process.env.secret

function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        profileImg:user.profileImageUrl,
        role:user.role,
    };
    const token=jwt.sign(payload,secret,{
        expiresIn:'24h'
    })
    return token
}

function validateToken(token){
    const payload =jwt.verify(token,secret)
    return payload
}

module.exports ={
    createTokenForUser,validateToken
}