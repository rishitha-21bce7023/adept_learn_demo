require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel,{IUser} from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import jwt,{JwtPayload, Secret} from "jsonwebtoken";
import ejs from "ejs";
import path from "path"; 
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";


//register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string; 
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { name, email, password } = req.body;
    
  // Check if the email already exists
  const isEmailExist = await userModel.findOne({ email });
  if(isEmailExist) {
    return next(new ErrorHandler("Email already exist", 400));
  };

  // Create a new user
    const user :IRegistrationBody={
    name,
    email,
    password,
    //avatar: req.body.avatar, // If provided, add the avatar
  };


  // Assuming you have a function to create an activation token
    const activationToken = createActivationToken(user);
   
    const activationCode = activationToken.activationCode;

    const data ={user:{name:user.name},activationCode};
    const html =await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"),data);

    try{
        await sendMail({
          email:user.email,
          subject:"Activate your account",
          template:"activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success:true,
          message:`Please check your email:${user.email} to activate your account!` ,
          activationToken : activationToken.token,          
        });
    }
    catch(error:any){
        return next(new ErrorHandler(error.message,400))
    }
  }

// Error handler for failed registration
catch(error: any) {
  return next(new ErrorHandler(error.message, 400))
}
});

interface IActivationToken{
  token:string;
  activationCode:string;
}

export const createActivationToken=(user:any):IActivationToken=>{
  const activationCode =Math.floor(1000+Math.random()*9000).toString();

  const token =jwt.sign({
    user,activationCode
  },process.env.ACTIVATION_SECRET as Secret,
  {
  expiresIn:"5m",
    });
  return {token,activationCode};
};

//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code }= req.body as IActivationRequest ;

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await userModel.findOne({ email });
    
    if (existUser) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
    });
   }
  catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


//Login User
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    };

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    };
    
    sendToken(user,200,res);
    //const accessToken =user.signAccessToken();
  } 
  
  catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


//logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies for access_token and refresh_token
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      
    //const userId: string = req.user?._id?.toString() || '';
     const userId = req.user?._id || "";
     redis.del(userId);

      // Send success response
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      }
    );
    } 
    
    catch (error: any) {
      // Pass the error to your custom error handler
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
 

//updateAccessToken

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(
      refresh_token, 
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;

    const message = "Could not refresh token";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id as string);

    if (!session) {
      return next(new ErrorHandler(message, 400));
    }

    const user = JSON.parse(session);

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { 
        expiresIn: "5m" ,
      } 
    );
    
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "3d" ,

      } 
    );
    
    req.user =user;

    res.cookie("access_token",accessToken,accessTokenOptions);
    res.cookie("refresh_token",refreshToken,refreshTokenOptions);

    res.status(200).json({
      status:"success",
      accessToken,
    })

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
}
);

// Get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id || "";

      getUserById(userId, res);
      /* if (!userId) {
        return next(new ErrorHandler("User ID is missing", 400));
      }
      await getUserById(userId.toString(), res);
    } */

    } 
    catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
interface ISocialAuthBody{
  email:string;
  name:string;
  avatar:string;
}
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      // Find the user by email
      const user = await userModel.findOne({ email });

      if (!user) {
        // If user doesn't exist, create a new one
        const newUser = await userModel.create({ email, name, avatar });
        // Send token for the new user
        sendToken(newUser, 200, res);
      } 
      else {
        // If user exists, send token for existing user
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);



//update user Info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body as IUpdateUserInfo;
    const userId = req.user?._id || "";
    const user = await userModel.findById(userId);
    
    if(email && user) {
      const isEmailExist = await userModel.findOne({email});      
      if(isEmailExist) {      
      return next(new ErrorHandler("Email already exist", 400));  
      }
      user.email=email;
    }

    if(name && user) {   
      user.name= name;      
    }
      
    await user?.save();
      
    await redis.set(userId,JSON.stringify(user));      
      res.status(201).json({      
      success:true,      
      user,      
      } );
    }
      catch (error: any) {      
      return next(new ErrorHandler(error.message, 400));      
      }
    });


// update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;
    
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter old and new password",400));
    }
    
    const user = await userModel.findById(req.user?._id).select("+password");

    if(user?.password===undefined){
      return next(new ErrorHandler("Invalid user",400));
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid old password", 400));
    }

    user.password = newPassword;

    await user.save();

    const userId = req.user?._id;

    if (!userId) {
         return next(new ErrorHandler("User ID not found", 400));
       }

    await redis.set(userId, JSON.stringify(user));

    res.status(201).json({      
      success:true,      
      user,      
      } );
  } 
  catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


//update profile picture
interface IUpdateProfilePicture{
  avatar:string;
}

export const updateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
     const{avatar}=req.body;
     
     const userId = req.user?._id || "";

     const user = await userModel.findById(userId);
     
     if(avatar && user){
      //if we have one avatar then call this if
     if(user?.avatar?.public_id){
      //first delete the old image
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(avatar,{
        folder :"avatars",  
        width:150,
       });
       user.avatar={
         public_id:myCloud.public_id,
         url:myCloud.secure_url,
       }
     }
     else{
      const myCloud = await cloudinary.v2.uploader.upload(avatar,{
       folder :"avatars",  
       width:150,
      });
      user.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
      }
     }
  }

  await user?.save();

  await redis.set(userId,JSON.stringify(user));

  res.status(200).json({      
    success:true,      
    user,      
    } );
}
  catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//get all users --- only for admin
export const getAllUsers= CatchAsyncError(

  async (req: Request, res: Response, next: NextFunction) => {
  
  try {
   getAllUsersService(res);
  } catch (error: any) { 
  return next(new ErrorHandler(error.message, 400));
  }
}
);

// Update user role --- only for admin
export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
      try {
          const { id, role } = req.body;
          await updateUserRoleService(res, id, role);
      } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
      }
  }
);

//Delete user --- only for admin
export const deleteUser =CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;

    const user =await userModel.findById(id);

    if(!user){
      return next(new ErrorHandler("user not found",404));
    }

    await user.deleteOne({id});

    await redis.del(id);

    res.status(200).json({
      success:true,
      message:"user deleted successfully",
    });
  }catch(error:any){
    return next(new ErrorHandler(error.message,400));
  }
});

