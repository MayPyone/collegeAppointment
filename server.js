import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'


const app = express();
const port = process.env.PORT || 3000

connectDB()

//middleware
app.use(express.json())
app.use(cors())

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