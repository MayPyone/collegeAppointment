import Joi from "joi";
import mongoose from "mongoose";
const {required} = Joi

const appointmentSchema = new mongoose.Schema({
    studentId: {type: String, required: true},
    professorId: {type: String, required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    studentData : {type: Object, required: true},
    professorData : {type: Object, required: true},
    date: {type: Number, required: true},
    cancelled: {type: Boolean, default: false},
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel