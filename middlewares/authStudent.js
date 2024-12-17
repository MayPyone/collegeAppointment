import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

const authStudent = async(req,res,next) => {
    try{
      const  {token} = req.headers
        if(!token){
            res.status(401).json({success:false, message: 'Please Log in again!'})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.body.studentId = token_decode.id
        next()

    }catch(error){
        res.status(401).json({success: true, message: 'Invalid credential'})
    }
}

export default authStudent   