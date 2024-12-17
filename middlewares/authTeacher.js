import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

const authTeacher = async(req,res,next) => {
    try{
      const  {token} = req.headers
      console.log(token)
        if(!token){
            return res.status(401).json({success:false, message: 'Token missing, Please Log in again!'})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.body.teacherId = token_decode.id
        next()

    }catch(error){
        console.log(error)
        return res.status(401).json({success: true, message: 'Invalid credential'})
    }
}

export default authTeacher   