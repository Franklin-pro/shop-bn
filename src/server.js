import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors'
import router from "./router/index";
import path from 'path'


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use('/',router)
app.use(bodyParser.urlencoded({extended: true}))


const port = process.env.PORT
const database = process.env.DATABASE

app.listen(port , ()=>{
    console.log(`port running on ${port}`)
})

mongoose.connect(database).then(()=>{
    console.log('database connected successfully')
})
