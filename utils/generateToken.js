const jwt = require('jsonwebtoken');
require('dotenv').config()
const generateToken = (id) => {
    // console.log(process.env.JWT_SECRET)
    return jwt.sign({id},process.env.JWT_TOKEN,{
        expiresIn: "1d"
    });
};

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    const token = req.body.token
    if(token==null) return res.status(401)
    jwt.verify(token,process.env.JWT_TOKEN,(err,userId)=>{
        console.log('userId',userId)
        console.log('err',err)
        if(err) return res.status(403).json({error:'Session Expired'})
        req.userId = userId
        next()
    })
}

module.exports = {generateToken,authenticateToken};