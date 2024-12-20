import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import teacherModel from "../models/teacherModel.js";
import appointmentModel from "../models/appointmentModel.js";


const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const teacher = await teacherModel.findOne({ email })
        if (!teacher) {
          return  res.status(404).json({ success: false, message: "Teacher can't be found!" })
        }
        const isMatch = await bcrypt.compare(password, teacher.password)
        if (isMatch) {
            const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET)
          return  res.status(200).json({ success: true, token })
        } else {
          return  res.status(401).json({ success: false, message: "Invalid credential" })
        }
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message })
    }

}

const addAvailableSlots = async (req, res) => {
    try {
        const { slotDate, slotTime, email } = req.body
        const teacher = await teacherModel.findOne({ email })
        let available_slots = teacher.available_slots
        // if the available_slots object has the slotDate
        if (!available_slots[slotDate]) {
            available_slots[slotDate] = []
        }

        if (available_slots[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot is not free, already added!" })
        }

        available_slots[slotDate].push(slotTime)
        const data = await teacherModel.findByIdAndUpdate(teacher._id, { available_slots }, { new: true })
      return  res.json({ success: true, available_slots: data.available_slots })
    } catch (error) {
      return  res.status(500).json({ success: false, message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId, teacherId } = req.body

        if (!appointmentId) {
            return res.status(404).json({ success: false, message: "Appointment is not found!" })
        }

        const appointment = await appointmentModel.findOne({ _id: appointmentId })

        if (!teacherId || teacherId !== appointment.teacherId.toString()) {
            return res.status(404).json({ success: false, message: "Teacher is not found!" })
        }

        await appointmentModel.findByIdAndUpdate({ _id: appointmentId }, { cancelled: true }, { new: true })

        return res.status(200).json({ success: true, message: "Appointment was cancelled" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { teacherLogin, addAvailableSlots, cancelAppointment }