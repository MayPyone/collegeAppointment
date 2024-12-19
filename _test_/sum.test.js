// import {MongoClient}  from 'mongodb'
// import request from "supertest"
// import app from '../server.js'
// import bcrypt from "bcrypt"
// import mongoose from 'mongoose'
// import { studentLogin } from "../controllers/studentController.js"

// describe('student login', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db(globalThis.__MONGO_DB_NAME__);
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');
  
//     const mockUser = {_id: 'some-user-id', name: 'John'};
//     await users.insertOne(mockUser);
  
//     const insertedUser = await users.findOne({_id: 'some-user-id'});
//     expect(insertedUser).toEqual(mockUser);
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });


// });