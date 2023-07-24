import express from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRoute from './Routes/AuthRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import PostRoutes from './Routes/PostRoutes.js'

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.get('/', (req, res) => {
    res.send("Hello")
})

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() =>
        app.listen(process.env.PORT,
            () => console.log(`Server is started on ${process.env.PORT}`))
    ).catch((err) => console.log(err));

// Routess

app.use('/auth', AuthRoute);
app.use('/user', UserRoutes);
app.use('/post', PostRoutes)