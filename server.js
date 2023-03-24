import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
// import db from './config/db.js';
import router from './Routes/User.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(router)
// app.use('/', express.static(__dirname + '/public'));
app.listen(process.env.PORT, ()=>{
  console.log('run on port 3800');
})