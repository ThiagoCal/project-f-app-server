import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './Routes/User.js';

import path from 'path';

import mongoose from 'mongoose';

const __dirname = path.resolve();
const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(router);

const dbUser = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASS 


//register user
app.post('/auth/register', async(req,res) =>{
    const { name, email, password, confirmpassword } = req.body
})

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@party-app.lrzcgln.mongodb.net/?retryWrites=true&w=majority`
).then(()=>{
    app.listen(4900)
    console.log('connected to 4900')
})
