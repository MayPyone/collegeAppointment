import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import adminRouter from './routes/adminRoute.js'
import studentRouter from './routes/studentRoute.js'
import teacherRouter from './routes/teacherRoute.js'

const app = express();
const port = process.env.PORT || 3000

connectDB()

//middleware
app.use(express.json())
app.use(cors())

app.use('/api/admin',adminRouter)
app.use('/api/student',studentRouter)
app.use('/api/teacher',teacherRouter)

app.get('/',(req,res) =>(
    res.send('api working')
))

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, Listening on port", port);
    }

    else {
        console.log("Error occurred, server can't start", error);
    }
}
);