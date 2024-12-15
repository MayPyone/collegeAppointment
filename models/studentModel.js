import Joi from "joi";
import mongoose from "mongoose";
const {required} = Joi

const studentSchema = new mongoose.Schema({
    name: {type:String ,required: true},
    email: {type:String ,required: true, unique: true},
    password: {type:String ,required: true},
    role: {type: String, enum: ['teacher','student'], default: 'student'}
})

const studentModel = mongoose.models.professor || mongoose.model('student',studentSchema)

export default studentModel