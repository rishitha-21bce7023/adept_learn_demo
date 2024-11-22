import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//authenticated user
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Extract access token from cookies
  const access_token = req.cookies.access_token;

  // If access token is not found, return an error
  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  // Verify the token
  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string)as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler("Access token is not valid", 400));
  }

  // Fetch user from Redis based on decoded token ID
  const user = await redis.get(decoded.id);

  if (!user) {
    return next(new ErrorHandler("please login to access this resource", 400));
  }

  // Parse user data and attach it to req object
  req.user = JSON.parse(user);

  // Proceed to the next middleware
  next();
  }
);


//validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
    }
    next();
  }
};