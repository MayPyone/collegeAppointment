import {MongoClient}  from 'mongodb'
import request from "supertest"
import app from '../server.js'
import mongoose from 'mongoose'
import teacherModel from '../models/teacherModel.js';
import studentModel from '../models/studentModel.js';

describe('student login', () => {
  let connection;
  let db;

   beforeAll(async () => {
      connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });


  it('should login students and return a token', async () => {
    
    const student1 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student1@gmail.com',
      password: '12345678'
    });

    const student2 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student2@gmail.com',
      password: '12345678'
    });



    expect(student1.status).toBe(200);
    expect(student1.body.success).toBe(true);
    expect(student1.body).toHaveProperty('token');

    expect(student2.status).toBe(200);
    expect(student2.body.success).toBe(true);
    expect(student2.body).toHaveProperty('token');
  });

  it("should be able to see professor's free slots", async () => {
    
    const student1 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student1@gmail.com',
      password: '12345678'
    });

  const token = student1.body.token
  const free_slots = await request(app)
  .get('/api/student/available-slots')
  .set('token', token) 
  .send({
    teacherEmail: "su@gmail.com"
  })
    expect(student1.status).toBe(200);
    // expect(free_slots.body.availableSlots).toBeDefined();
  });

  it("should be able to book 2 appointments for 2 students", async () => {
    
    const student1 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student1@gmail.com',
      password: '12345678'
    });

    const student2 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student2@gmail.com',
      password: '12345678'
    });

  const token1 = student1.body.token
  const token2 = student2.body.token
  const teacher = await teacherModel.findOne({email: "su@gmail.com"})
  const student1_information = await studentModel.findOne({ email: "student1@gmail.com" });
  const student2_information = await studentModel.findOne({ email: "student2@gmail.com" });
  
   
 
  // const newAppointment1 = await request(app)
  // .post('/api/student/book-appointment')
  // .set('token', token1) 
  // .send({
  //   studentId: student1_information._id,
  //   teacherId: teacher._id,
  //   slotDate: '22/12/2024',
  //   slotTime: "9:00AM - 11:00AM"
  // })
  //   expect(newAppointment1.status).toBe(200);

  //   const newAppointment2 = await request(app)
  // .post('/api/student/book-appointment')
  // .set('token', token2) 
  // .send({
  //   studentId: student2_information._id,
  //   teacherId: teacher._id,
  //   slotDate: '23/12/2024',
  //   slotTime: "9:00AM - 11:00AM"
  // })
  //   expect(newAppointment1.status).toBe(200);
  //   expect(newAppointment2.status).toBe(200);
    
  });

  it("should show all appointments of students apart from cancellations ", async () => {
    
    const student1 = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student1@gmail.com',
      password: '12345678'
    })

    const token = student1.body.token

    const student1_information = await studentModel.findOne({ email: "student1@gmail.com" });
    console.log('student info',student1_information)

    const getAllAppointments = await request(app)
    .post('/api/student/my-appointments')
    .set('token', token)
    .send({
      studentId: student1_information._id
    })

    
    console.log("Response Body:", getAllAppointments.body);
    expect(getAllAppointments.body.success).toBe(true)
    // expect(student2.body.success).toBe(true);
  })
    afterAll(async () => {
      await mongoose.connection.close();
    });
});