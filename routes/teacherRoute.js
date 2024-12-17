import express from "express"
import authTeacher from "../middlewares/authTeacher.js"
import { teacherLogin, addAvailableSlots } from "../controllers/teacherController.js"

const teacherRouter = express.Router()

teacherRouter.post('/login', teacherLogin)
teacherRouter.post('/add-available-slots',authTeacher,addAvailableSlots)

export default teacherRouter