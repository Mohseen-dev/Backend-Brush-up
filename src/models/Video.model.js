import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoFile: {
      type: String,
      required: [true, "File is required!"],
    },
    thumbnail: {
      type: String, //* cloudinary url
      required: [true, "Thumbnail is required!"],
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    duration: {
      type: Number, //* come from cloudinary url
      required: [true, "Duration is required"],
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPulished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
