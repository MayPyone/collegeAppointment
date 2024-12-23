
# College Appointment System Backend APIs

<a name="readme-top"></a>

## 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
    - [🚀 Live Demo](#live-demo)
  - [🚀 Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running the Application](#running-the-application)
    - [Running Tests](#running-tests)
  - [🗂 Database Schema](#database-schema)
  - [📋 API Endpoints](#api-endpoints)
  - [🧪 Automated E2E Test Case](#automated-e2e-test-case)
  - [🎥 Submission Videos](#submission-videos)
- [👤 Author](#author)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# College Appointment System Backend APIs <a name="about-project"></a>

This project implements backend APIs for a college appointment system that allows students to book appointments with professors. The system includes authentication for users, availability management for professors, appointment scheduling for students, and cancellation functionality. An end-to-end (E2E) automated test validates the key user flow, ensuring the APIs function as expected.

---

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

- **Node.js**: JavaScript runtime for building scalable backend services.
- **Express.js**: Framework for creating robust APIs.
- **MongoDB**: Database to store users, availability, and appointment details.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Jest**: Framework for automated testing.
- **Supertest**: Library for testing HTTP APIs.

### Key Features <a name="key-features"></a>

1. **User Authentication**: Students and professors can securely log in to access the system.
2. **Availability Management**: Professors can specify their available time slots for appointments.
3. **Appointment Booking**: Students can view professors' available slots and book appointments.
4. **Appointment Cancellation**: Professors can cancel existing appointments.
5. **Automated E2E Testing**: Validates the full user flow described in the requirements.

---

## 🚀 Live Demo <a name="live-demo"></a>

- [Live Demo Link](https://collegeappointment.onrender.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Getting Started <a name="getting-started"></a>

Follow these steps to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud-based)
- **Postman** for manual API testing

### Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository-link.git
    cd college-appointment-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables by creating a `.env` file in the project root with the following content:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/college_appointments
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. Start the server:
    ```bash
    npm start
    ```

2. The API will be available at `http://localhost:3000`.

### Running Tests

To run the automated E2E tests:
```bash
npm test
```

---

## 🗂 Database Schema <a name="database-schema"></a>

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" // "student" or "professor"
}
```

### Availability Collection
```json
{
  "_id": "ObjectId",
  "professorId": "ObjectId",
  "availableSlots": ["Object"]
}
```

### Appointments Collection
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId",
  "professorId": "ObjectId",
  "timeSlot": "string", // Appointment time slot
  "status": "string" // "booked" or "cancelled"
}
```

---

## 📋 API Endpoints <a name="api-endpoints"></a>

### Authentication

1. **Student Login**
   - **Method**: `POST`
   - **Endpoint**: `/api/student/login`
   - **Body**:
     ```json
     {
       "email": "student@example.com",
       "password": "password123"
     }
     ```

2. **Teacher Login**
   - **Method**: `POST`
   - **Endpoint**: `/api/teacher/login`
   - **Body**:
     ```json
     {
       "email": "teacher@example.com",
       "password": "password123"
     }
     ```

### Availability Management

1. **Set Availability**
   - **Method**: `POST`
   - **Endpoint**: `/api/teacher/add-available-slots`
   - **Body**:
     ```json
     {
        "email": "teacher@example.com",
        "slotDate": "19/12/2024",
        "slotTime": "1:00PM - 3:00PM"
     }
     ```

2. **View Availability**
   - **Method**: `GET`
   - **Endpoint**: `/api/student/my-appointments`
   - **Body**:
     ```json
     {
       "teacherEmail": "teacher@example.com"
     }
     ```

### Appointments

1. **Book Appointment**
   - **Method**: `POST`
   - **Endpoint**: `/api/appointments`
   - **Body**:
     ```json
     {
       "studentId": "676438ac6b3e22727b57d479",
       "teacherId": "6765a5d179df7dca0830ead3",
       "slotDate": "19/12/2024",
       "slotTime": "1:00PM - 3:00PM"
     }
     ```

2. **Cancel Appointment**
   - **Method**: `POST`
   - **Endpoint**: `/api/teacher/cancel-appointment`
   - **Body**:
     ```json
     {
      "appointmentId": "6765a76579df7dca0830eae4",
      "teacherId": "6765a5d179df7dca0830ead3"
     }
     ```

3. **View Appointments**
   - **Method**: `GET`
   - **Endpoint**: `/api/student/my-appointments?studentId=676438ac6b3e22727b57d479`

---

## 🧪 Automated E2E Test Case <a name="automated-e2e-test-case"></a>

The automated test case validates the following flow:
1. A student logs in.
2. A professor logs in and specifies available slots.
3. The student views available slots and books an appointment.
4. Another student logs in and books a different slot.
5. The professor cancels the first appointment.
6. The first student verifies their updated appointment status.

Run the test suite using:
```bash
npm test
```

---

## 🎥 Submission Videos <a name="submission-videos"></a>

1. **Code Explanation and Automated Test Case**: https://drive.google.com/file/d/10PbEGjlWOJ9lMWQwbqqBeubdC5kPZXsG/view?usp=sharing
2. **Manual API Testing**: https://drive.google.com/file/d/10myq9RtjCyc96pQmv9WIcul8rU1MQTYY/view?usp=sharing

---

## 👤 Author <a name="author"></a>

**May Pyone**
- GitHub: https://github.com/MayPyone
- Email: maypyone015@gmail.com

---

## 📝 License <a name="license"></a>

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
