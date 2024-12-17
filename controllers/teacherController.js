import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import teacherModel from "../models/teacherModel.js";
import appointmentModel from "../models/appointmentModel.js";


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

const addAvailableSlots = async (req, res) => {
    try {
      const {slotDate, slotTime, email} = req.body
      const teacher = await teacherModel.findOne({email})
      let avaiable_slots = teacher.avaiable_slots
      if(!avaiable_slots[slotDate]) {
        avaiable_slots[slotDate] = []
      }

      if(avaiable_slots[slotDate].includes(slotTime)){
          return res.json({success: false, message: "Slot is not free, already added!"})
      }

      avaiable_slots[slotDate].push(slotTime)
     const data= await teacherModel.findByIdAndUpdate(teacher._id,{avaiable_slots},{new: true})
      res.json({success: true, data})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try{
       const {appointmentId, teacherId} = req.body
       console.log(teacherId)
       const appointment = await appointmentModel.findOne({_id: appointmentId})
       console.log(appointment.teacherId)
       if(!teacherId || teacherId !== appointment.teacherId.toString() ) {
        return res.json({success: false, message: "Teacher is not found!"})
       }
       if(!appointmentId){
        return res.json({success: false, message: "Appointment is not found!"})
       }
      
       await appointmentModel.findByIdAndUpdate({_id: appointmentId},{cancelled: true},{new: true})
       
       res.json({success: true, message: "Appointment was cancelled"})
       
    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}



export { teacherLogin, addAvailableSlots, cancelAppointment }