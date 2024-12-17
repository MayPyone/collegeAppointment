import express from "express"
import { studentLogin, getAvaiableSlots, bookAppointment } from "../controllers/studentController.js"
import authStudent from "../middlewares/authStudent.js"

const studentRouter = express.Router()

studentRouter.post('/login',studentLogin)
studentRouter.get('/available-slots',authStudent, getAvaiableSlots)
studentRouter.post('/book-appointment', authStudent, bookAppointment)

export default studentRouter