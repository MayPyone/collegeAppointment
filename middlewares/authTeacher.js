import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

const authTeacher = async(req,res,next) => {
    try{
      const  {token} = req.body
        if(!token){
            res.status(401).json({success:false, message: 'Please Log in again!'})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.body.teacherId = token_decode.id

    }catch(error){
        res.status(401).json({success: true, message: 'Invalid credential'})
    }
}

export default authTeacher   