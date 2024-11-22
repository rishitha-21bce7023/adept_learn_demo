import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Interface for Comments
interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies : IComment[];
}

// Interface for Reviews
interface IReview extends Document {
    user: IUser,
    rating: number,
    comment: string;
    commentReplies: IComment[];
}

// Interface for Links
interface ILink extends Document {
    title: string;
    url: string;
}

// Interface for Course Data
interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

// Interface for Course
interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

// Schema for Review
const reviewSchema = new Schema<IReview>({
  user:Object,
  rating: {
    type: Number, 
    default: 0,
   },
  comment: String,
  commentReplies : [Object],
});

// Schema for Link
const linkSchema = new Schema<ILink>({
  title:String,
  url:String, 
});

// Schema for Comment
const commentSchema = new Schema<IComment>({
  user:Object,
  question:String,
  questionReplies: [Object],
});

// Course Data Schema
const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

// Course Schema
const courseSchema = new Schema<ICourse>({
  name: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      required: true,
  },
  price: {
      type: Number,
      required: true,
  },
  estimatedPrice: {
      type: Number,
  },
  thumbnail:{
    public_id:{
      type: String,
    },
    url:{
      type: String,
    },
  },
  tags:{
    type: String,
    required: true,
  },
  level:{
    type: String,
    required: true,
  },
  demoUrl:{
    type: String,
    required: true,
  },
  benefits:[{title:String}],
  prerequisites:[{title:String}],
  reviews:[reviewSchema],
    courseData :[courseDataSchema],
    ratings:{
      type: Number,
      default:0,
    },
    purchased:{
      type: Number,
      default:0,
    },    
},{timestamps : true});

const CourseModel: Model<ICourse> = mongoose.model("Course",courseSchema);

export default CourseModel;