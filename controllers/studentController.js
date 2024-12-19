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
            return res.status(404).json({ success: false, message: "Student can't be found!" })
        }
        const isMatch = await bcrypt.compare(password, student.password)
        if (isMatch) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET)
            return res.status(200).json({ success: true, token })
        } else {
            return res.status(401).json({ success: false, message: "Invalid credential" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

const getAvailableSlots = async (req, res) => {
    try {
        const { teacherEmail } = req.body
        if (!teacherEmail) {
            return res.status(400).json({ success: false, message: "Please provide teacher's email to see his available time!" })
        }
        const teacher = await teacherModel.findOne({ email: teacherEmail })
        const available_slots = teacher.available_slots;
        return res.status(200).json({ success: true, available_slots })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { studentId, teacherId, slotDate, slotTime } = req.body
        if (!studentId || !teacherId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: "Missing information" })
        }

        const teacher = await teacherModel.findOne({ _id: teacherId })
        const available_slots = teacher.available_slots
        if (!available_slots[slotDate] || !available_slots[slotDate].includes(slotTime)) {
            return res.status(404).json({ success: false, message: "Teacher is not avaiable at this time" })
        }

        const appointment = {
            studentId,
            teacherId,
            slotDate,
            slotTime,
            date: Date.now()
        }
        const newAppointment = await new appointmentModel(appointment)
        newAppointment.save()


        let slot_booked = teacher.slot_booked

        if (!slot_booked[slotDate]) {
            slot_booked[slotDate] = []
        }

        if (slot_booked[slotDate].includes(slotTime)) {
            return res.status(400).json({ success: false, message: "Not available" })
        }

        slot_booked[slotDate].push(slotTime)


        await teacherModel.findByIdAndUpdate(teacherId, { slot_booked }, { new: true })

        return res.status(200).json({ success: true, message: "Booked an appointment successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getAllAppointments = async (req, res) => {
    try {
        const { studentId } = req.body
        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }
        const appointments = await appointmentModel.find({ studentId: studentId, cancelled: false });

        return res.status(200).json({ success: true, appointments })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export { studentLogin, bookAppointment, getAvailableSlots, getAllAppointments }