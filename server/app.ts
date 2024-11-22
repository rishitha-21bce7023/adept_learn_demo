require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

//body parser
app.use(express.json({ limit: "50mb" }));
//cookie parser
app.use(cookieParser());
//cors =>cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true, 
}));

// Routes
app.use("/api/v1", userRouter , courseRouter , orderRouter , notificationRouter , analyticsRouter , layoutRouter );

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API IS WORKING",
    });
});

// Catch-all for undefined routes
//app.use((req: Request, res: Response, next: NextFunction) => {
//    next(new ErrorHandler('Not Found', 404));
//  });

//unknown route
app.all("*",(req: Request, res: Response, next: NextFunction) => {
  const err=new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode=404;
  next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);