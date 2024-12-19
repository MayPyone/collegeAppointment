import {MongoClient}  from 'mongodb'
import request from "supertest"
import app from '../server.js'
import mongoose from 'mongoose'
import teacherModel from '../models/teacherModel.js';
import appointmentModel from '../models/appointmentModel.js';

describe('professor login', () => {
  let connection;
  let db;

   beforeAll(async () => {
      connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });


  it('should login and return a token', async () => {
    
 
    const professor = await request(app)
    .post('/api/teacher/login')
    .send({
      email: 'su@gmail.com',
      password: '12345678'
    });

    expect(professor.status).toBe(200);
    expect(professor.body.success).toBe(true);
    expect(professor.body).toHaveProperty('token');

  });

  it('should specify free slots', async () => {
    const professor = await request(app)
    .post('/api/teacher/login')
    .send({
      email: 'su@gmail.com',
      password: '12345678'
    });
    const token = professor.body.token

    const available_slots = await request(app)
    .post('/api/teacher/add-available-slots')
    .set('token', token) 
    .send({
        slotDate: '23/12/2024',
        slotTime: "9:00AM - 11:00AM",
        email: "su@gmail.com"
    })
    expect(available_slots.body.success).toBe(true);
    expect(available_slots.body.available_slots['23/12/2024']).toContain('9:00AM - 11:00AM');
  });


  it('should cancel the appointemnt', async () => {
    const professor = await request(app)
    .post('/api/teacher/login')
    .send({
      email: 'su@gmail.com',
      password: '12345678'
    });
    const token = professor.body.token

    const professor_information = await teacherModel.findOne({email: 'su@gmail.com'})
    const appointment_data = await appointmentModel.find({slotDate: '19/12/2024', slotTime: '1:00PM - 3:00PM',teacherId :professor_information._id})
    const cancellation = await request(app)
    .post('/api/teacher/cancel-appointment')
    .set('token', token) 
    .send({
        appointmentId: appointment_data._id,
        teacherId: professor_information._id
    })
    expect(cancellation.body.success).toBe(true);
    expect(cancellation.status).toBe(200)
    
  });




    afterAll(async () => {
      await mongoose.connection.close();
    });
});