import jwt from "jsonwebtoken"

const authStudent = async(req,res,next) => {
    try{
      const  {token} = req.headers
        if(!token){
          return  res.status(401).json({success:false, message: 'Please Log in again!'})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.body.studentId = token_decode.id
        next()

    }catch(error){
      return  res.status(401).json({success: false, message: 'Invalid credential'})
    }
}

export default authStudent   