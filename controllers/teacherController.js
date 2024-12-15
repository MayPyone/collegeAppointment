import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import teacherModel from "../models/teacherModel.js";


const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const teacher = await teacherModel.findOne({ email })
        if (!teacher) {
            res.status(404).json({ success: false, message: "Teacher can't be found!" })
        }
        const isMatch = await bcrypt.compare(password, teacher.password)
        if (isMatch) {
            const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET)
            res.status(200).json({ success: true, token })
        } else {   
            res.status(401).json({ success: false, message: "Invalid credential" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ success: false, message: error.message })
    }

}

export {teacherLogin}