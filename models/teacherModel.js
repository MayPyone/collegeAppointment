import Joi from "joi";
import mongoose from "mongoose";
const {required} = Joi

const teacherSchema = new mongoose.Schema({
    name: {type:String ,required: true},
    email: {type:String ,required: true, unique: true},
    password: {type:String ,required: true},
    slot_booked: {type:Object, default: {}},
    avaiable_slots:{type:Object, default:{}},
    role: {type: String, enum: ['teacher','student'], default: 'student'}
}, { minimize: false })

const teacherModel = mongoose.models.professor || mongoose.model('teacher',teacherSchema)

export default teacherModel