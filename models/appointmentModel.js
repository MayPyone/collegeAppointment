import Joi from "joi";
import mongoose from "mongoose";
const {required} = Joi

const appointmentSchema = new mongoose.Schema({
    studentId: {type: mongoose.Types.ObjectId,ref: 'student', required: true},
    teacherId: {type: mongoose.Types.ObjectId,ref: 'teacher', required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    date: {type: Number, required: true},
    cancelled: {type: Boolean, default: false},
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel