import { app } from "./app";
import {v2 as cloudinary} from "cloudinary";
import connectDB from './utils/db'; // Import the connection function
import express, { Request, Response, NextFunction } from 'express';
require("dotenv").config();
//import cors from 'cors';
/*app.use(cors({
    origin: process.env.ORIGIN, // allow only your frontend origin
    credentials: true, // allows credentials like cookies to be sent
  //  allowedHeaders: ["Content-Type", "Authorization"], // allow necessary headers
  //  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow necessary methods
}));
*/

//cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
});

// create the server
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB();
});