import express from "express"
import { studentLogin } from "../controllers/studentController.js"

const studentRouter = express.Router()

studentRouter.post('/login',studentLogin)

export default studentRouter