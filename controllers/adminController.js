import validator from "validator"
import bcrypt from "bcrypt"
import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";

const addStudent = async (req, res) => {
    try{
      const  {name,email,password} = req.body
      if(!name || !email || !password) {
        return res.status(400).json({success: false, message: 'Missing details!'})
      }

      if(!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "please enter a valid email" })
      }

      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "your password needs to be at least 8 characters" })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const studentData = {
        name,
        email,
        password: hashedPassword
      }
      
      const newStudent = await new studentModel(studentData)
      await newStudent.save()

      return res.status(201).json({success: true, message: "Student Added Successfully"})

    }catch(error){
        return res.status(400).json({success: false, message: error.message})
    }

}

const addTeacher = async (req, res) => {
    try{
      const  {name,email,password} = req.body

      if(!name || !email || !password) {
        return res.status(400).json({success: false, message: 'missing details!'})
      }

      if(!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "please enter a valid email" })
      }

      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "your password needs to be at least 8 characters" })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const teacherData = {
        name,
        email,
        password: hashedPassword,
        role: "teacher"
      }
      
      const newTeacher = await new teacherModel(teacherData)
      await newTeacher.save()

      return res.status(201).json({success: true, message: "Teacher Added Successfully"})

    }catch(error){
        console.log(error)
        return res.status(400).json({success: false, message: error.message})
    }

}

export {addStudent, addTeacher}