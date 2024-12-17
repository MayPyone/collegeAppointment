import express from "express"
import authTeacher from "../middlewares/authTeacher.js"
import { teacherLogin, addAvailableSlots, cancelAppointment } from "../controllers/teacherController.js"

const teacherRouter = express.Router()

teacherRouter.post('/login', teacherLogin)
teacherRouter.post('/add-available-slots',authTeacher,addAvailableSlots)
teacherRouter.post('/cancel-appointment',authTeacher, cancelAppointment)

export default teacherRouter