import { MongoClient } from 'mongodb'
import request from "supertest"
import app from '../server.js'
import mongoose from 'mongoose'
import teacherModel from '../models/teacherModel.js';
import appointmentModel from '../models/appointmentModel.js';
import studentModel from '../models/studentModel.js';

describe('professor login', () => {
  let connection;
  let db;
  let teacher_token;
  let professor;
  let student;
  let student_token;
 
  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
   await request(app).post('/api/admin/addTeacher').send({name: 'candy', email: 'candy@gmail.com', password: '12345678'})

   await request(app).post('/api/admin/addStudent').send({ name: 'student1',email: 'student1@gmail.com', password: '12345678'})
   await request(app).post('/api/admin/addStudent').send({ name: 'student2',email: 'student2@gmail.com', password: '12345678'})


    professor = await request(app)
      .post('/api/teacher/login')
      .send({
        email: 'candy@gmail.com',
        password: '12345678'
      });

      student = await request(app)
      .post('/api/student/login')
      .send({
        email: 'student1@gmail.com',
        password: '12345678'
      })
      
      teacher_token = professor.body.token
      student_token = student.body.token
  });


  it('should login and return a token', async () => {


    const professor = await request(app)
      .post('/api/teacher/login')
      .send({
        email: 'candy@gmail.com',
        password: '12345678'
      });

    expect(professor.status).toBe(200);
    expect(professor.body.success).toBe(true);
    expect(professor.body).toHaveProperty('token');

  });

  it('should specify free slots', async () => {


    const available_slots = await request(app)
      .post('/api/teacher/add-available-slots')
      .set('token', teacher_token)
      .send({
        slotDate: '23/12/2024',
        slotTime: "9:00AM - 11:00AM",
        email: "candy@gmail.com"
      })
    expect(available_slots.body.success).toBe(true);
    expect(available_slots.body.available_slots['23/12/2024']).toContain('9:00AM - 11:00AM');
  });


  it('should cancel the appointemnt', async () => {
   //book one appointment
   const student1_information = await studentModel.findOne({email: 'student1@gmail.com'})
   const professor_information = await teacherModel.findOne({email: 'candy@gmail.com'})

    const appointment1 = await request(app)
    .post('/api/student/book-appointment')
    .set('token',student_token)
    .send({
      teacherId: professor_information._id,
      studentId: student1_information._id,
      slotDate: '23/12/2024',
      slotTime: "9:00AM - 11:00AM"
    })
    const appointment_data = await appointmentModel.find({slotDate: '23/12/2024', slotTime: '9:00AM - 11:00AM',teacherId :professor_information._id})
    const cancellation = await request(app)
    .post('/api/teacher/cancel-appointment')
    .set('token', teacher_token) 
    .send({
        appointmentId: appointment_data[0]._id,
        teacherId: professor_information._id
    })
    expect(cancellation.body.success).toBe(true);
    expect(cancellation.status).toBe(200)

  });




  afterAll(async () => {
    await mongoose.connection.close();
  });
});