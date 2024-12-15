import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import studentModel from "../models/studentModel.js";

const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const student = await studentModel.findOne({ email })
        if (!student) {
            res.status(404).json({ success: false, message: "Student can't be found!" })
        }
        const isMatch = await bcrypt.compare(password, student.password)
        if (isMatch) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET)
            res.status(200).json({ success: true, token })
        } else {
            res.status(401).json({ success: false, message: "Invalid credential" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ success: false, message: error.message })
    }

}

export {studentLogin}