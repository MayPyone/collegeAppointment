import express from "express"
import { addStudent, addTeacher } from "../controllers/adminController.js";

const adminRouter = express.Router()
adminRouter.post('/addStudent',addStudent)
adminRouter.post('/addTeacher',addTeacher)

export default adminRouter