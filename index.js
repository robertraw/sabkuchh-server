import express from "express";
import bodyParser from "body-parser"
import cors from "cors";
import Route from './path.js';
import  config from 'dotenv';
import connectDB from "./config/connect.js";

config.config();

export const app = express();
const PORT =process.env.PORT;
app.use(bodyParser.json({limit:"30mb",extended:"true"}));
app.use(express.json());
app.use(cors());
connectDB()
app.use('/',Route);
app.listen(PORT,()=>console.log('Server running on port 5000'));
  