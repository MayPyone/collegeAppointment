import { MongoClient } from 'mongodb'
import request from "supertest"
import app from '../server.js'
import mongoose from 'mongoose'
import teacherModel from '../models/teacherModel.js';
import studentModel from '../models/studentModel.js';

describe('student login', () => {
  let connection;
  let db;
  let teacher_token;
  let student1_token;
  let student2_token;
  let professor_information;
  let student1_information;
  let student2_information;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
    await request(app).post('/api/admin/addTeacher').send({ name: 'candy', email: 'candy@gmail.com', password: '12345678' })
    await request(app).post('/api/admin/addStudent').send({ name: 'student1', email: 'student1@gmail.com', password: '12345678' })
    await request(app).post('/api/admin/addStudent').send({ name: 'student2', email: 'student2@gmail.com', password: '12345678' })

    professor_information = await teacherModel.findOne({ email: "candy@gmail.com" });
    student1_information = await studentModel.findOne({ email: "student1@gmail.com" });
    student2_information = await studentModel.findOne({ email: "student2@gmail.com" });

    const professor = await request(app)
      .post('/api/teacher/login')
      .send({
        email: 'candy@gmail.com',
        password: '12345678'
      });

    const student1 = await request(app)
      .post('/api/student/login')
      .send({
        email: 'student1@gmail.com',
        password: '12345678'
      })

    const student2 = await request(app)
      .post('/api/student/login')
      .send({
        email: 'student2@gmail.com',
        password: '12345678'
      })
    console.log('professor', professor.body)
    console.log('student', student1.body)
    console.log('student', student2.body)
    teacher_token = professor.body.token
    student1_token = student1.body.token
    student2_token = student2.body.token
  });


  it('should login students and return a token', async () => {

    const student_one = await request(app)
      .post('/api/student/login')
      .send({
        email: 'student1@gmail.com',
        password: '12345678'
      });

    const student_two = await request(app)
      .post('/api/student/login')
      .send({
        email: 'student2@gmail.com',
        password: '12345678'
      });

    expect(student_one.status).toBe(200);
    expect(student_one.body.success).toBe(true);
    expect(student_one.body).toHaveProperty('token');

    expect(student_two.status).toBe(200);
    expect(student_two.body.success).toBe(true);
    expect(student_two.body).toHaveProperty('token');
  });

  it("should be able to see professor's free slots", async () => {
    const free_slots = await request(app)
      .get('/api/student/available-slots')
      .set('token', student1_token)
      .send({
        teacherEmail: "candy@gmail.com"
      })
    const available_slots = await request(app)
      .post('/api/teacher/add-available-slots')
      .set('token', teacher_token)
      .send({
        slotDate: '23/12/2024',
        slotTime: "9:00AM - 11:00AM",
        email: "candy@gmail.com"
      })
    expect(free_slots.body.available_slots['23/12/2024']).toContain('9:00AM - 11:00AM');
  });

  it("should be able to book 2 appointments for 2 students", async () => {

    const free_slot_one = await request(app)
      .post('/api/teacher/add-available-slots')
      .set('token', teacher_token)
      .send({
        slotDate: '24/12/2024',
        slotTime: "9:00AM - 11:00AM",
        email: "candy@gmail.com"
      })

    const free_slots_two = await request(app)
      .post('/api/teacher/add-available-slots')
      .set('token', teacher_token)
      .send({
        slotDate: '24/12/2024',
        slotTime: "1:00PM - 2:00PM",
        email: "candy@gmail.com"
      })

    const newAppointment1 = await request(app)
      .post('/api/student/book-appointment')
      .set('token', student1_token)
      .send({
        teacherId: professor_information._id,
        studentId: student1_information._id,
        slotDate: '24/12/2024',
        slotTime: "9:00AM - 11:00AM"
      })

    const newAppointment2 = await request(app)
      .post('/api/student/book-appointment')
      .set('token', student2_token)
      .send({
        studentId: student2_information._id,
        teacherId: professor_information._id,
        slotDate: '24/12/2024',
        slotTime: "1:00PM - 2:00PM"
      })
    expect(newAppointment1.status).toBe(200);
    expect(newAppointment2.status).toBe(200);

  });

  it("should show all appointments of students apart from cancellations ", async () => {

    const getAllAppointments = await request(app)
      .get('/api/student/my-appointments')
      .set('token', student1_token)
      .query({
        studentId: student1_information._id.toString()
      })
    expect(getAllAppointments.body.success).toBe(true)
  })

  
it('should not login students and not return a token', async () => {

  const student_one = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student1@gmail.com',
      password: '12345671'
    });

  const student_two = await request(app)
    .post('/api/student/login')
    .send({
      email: 'student@gmail.com',
      password: '12345673'
    });
  
  expect(student_one.status).toBe(401)
  expect(student_one.body.success).toBe(false);
  expect(student_one.body.message).toBe("Invalid credential")
  expect(student_two.status).toBe(401)
  expect(student_two.body.success).toBe(false);
  expect(student_two.body.message).toBe("Student can't be found!");
});

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
