import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import studentModel from "../models/studentModel.js";
import appointmentModel from "../models/appointmentModel.js";
import teacherModel from "../models/teacherModel.js";

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

const bookAppointment = async (req, res) => {
    try {
        const {studentId, teacherId, slotDate, slotTime} = req.body
        if(!studentId || !teacherId || !slotDate || !slotTime) {
            return res.json({success: false, message: "Missing information"})
        }

        const teacher = await teacherModel.findOne({_id: teacherId})
        const avaiable_slots = teacher.avaiable_slots
        if(!avaiable_slots[slotDate.includes(slotTime)]) {
            return res.json({success: false, message: "Teacher is not avaiable at this time"})
        }

        const appointment = {
            studentId,
            teacherId,
            slotDate,
            slotTime,
            date: Date.now()
        }
       const newAppointment= await new appointmentModel(appointment)
       newAppointment.save()

       
       let slot_booked = teacher.slot_booked

       if (!slot_booked[slotDate]) {
          slot_booked[slotDate] = []
       }

       if(slot_booked[slotDate].includes(slotTime)) {
          return res.json({success: false, message: "Not available"})
       }

       slot_booked[slotDate].push(slotTime)


      const newSlotbooked=  await teacherModel.findByIdAndUpdate(teacherId, {slot_booked},{new: true})

      console.log(newSlotbooked)

       return res.json({success: true, message: "Booked an appointment successfully"})



    } catch (error) {
        console.log(error.message)
        res.status(401).json({ success: false, message: error.message })
    }
}

export { studentLogin, bookAppointment }