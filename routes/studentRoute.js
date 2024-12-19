import express from "express"
import { studentLogin, getAvailableSlots, bookAppointment, getAllAppointments } from "../controllers/studentController.js"
import authStudent from "../middlewares/authStudent.js"

const studentRouter = express.Router()

studentRouter.post('/login',studentLogin)
studentRouter.get('/available-slots',authStudent, getAvailableSlots)
studentRouter.post('/book-appointment', authStudent, bookAppointment)
studentRouter.get('/my-appointments', authStudent, getAllAppointments)

export default studentRouter