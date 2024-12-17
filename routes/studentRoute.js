import express from "express"
import { studentLogin, bookAppointment } from "../controllers/studentController.js"
import authStudent from "../middlewares/authStudent.js"

const studentRouter = express.Router()

studentRouter.post('/login',studentLogin)
studentRouter.post('/book-appointment', authStudent, bookAppointment)

export default studentRouter