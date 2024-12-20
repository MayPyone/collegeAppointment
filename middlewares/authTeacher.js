import jwt from "jsonwebtoken"

const authTeacher = async(req,res,next) => {
    try{
      const  {token} = req.headers
        if(!token){
            return res.status(401).json({success:false, message: 'Token missing, Please Log in again!'})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.body.teacherId = token_decode.id
        next()

    }catch(error){
        return res.status(401).json({success: false, message: 'Invalid credential'})
    }
}

export default authTeacher   