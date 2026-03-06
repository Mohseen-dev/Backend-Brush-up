import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/Users.model.js";
import { uploadOnCloudinary } from "../utils/uploadFile.cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerController = asynchandler(async (req, res) => {
  //!Algorithm (task)
  // 1. get user details form frontend
  // 2. validate these user Details, these are empty or not and if return Error
  // 3. check User already Exist or not ,
  // 4.if Exist return Error
  // 5. check Images are coming or not
  // 6. Avatar is mandatory image or must required ,So validate it Otherwise return Error
  // 7. Upload these images on Cloudinary cloud platfrom
  // 8. validate cloudinary result and get images url and also validate it.
  // 9. create User object to save in Database
  // 10. after saving User data in DB , get User data from DB and remove password and refreshToken for Return "Response"
  // 11. return response OK.

  //! start

  // 1.-----------------------------------------------------------------

  const { userName, fullName, email, password } = req.body;

  // 2.-----------------------------------------------------------------

  if (
    [userName, fullName, email, password].some((field) => {
      field && field.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // 3.-----------------------------------------------------------------

  const isUserExist = await User.findOne({
    $and: [{ userName }, { email }],
  });

  // 4.-----------------------------------------------------------------

  if (isUserExist) throw new ApiError(400, "User already exist");

  // 5 and 6.-----------------------------------------------------------------

  let userCoverImageLocalPath;
  if (
    req.files &&
    req.files.coverImage &&
    req.files.coverImage.length > 0 &&
    req.files.coverImage[0].path
  )
    userCoverImageLocalPath = req.files.coverImage[0].path;
  if (
    !req.files ||
    !req.files.avatar ||
    !req.files.avatar > 0 ||
    !req.files.avatar[0].path
  )
    throw new ApiError(404, "avatar is required.");
  const userAvatarLocalPath = req.files.avatar[0].path;

  // 7.-----------------------------------------------------------------

  const CloudinaryCoverImageResponse = await uploadOnCloudinary(
    userCoverImageLocalPath
  );
  const CloudinaryAvatarResponse =
    await uploadOnCloudinary(userAvatarLocalPath);

  // 8.-----------------------------------------------------------------

  if (!CloudinaryAvatarResponse)
    throw new ApiError(500, "Somethind is wrong while uploading avatar");

  // 9.-----------------------------------------------------------------

  const newUserObject = await User.create({
    userName,
    fullName,
    email,
    avatar: CloudinaryAvatarResponse,
    coverImage: CloudinaryCoverImageResponse,
    password,
  });
  if (!newUserObject)
    throw new ApiError(
      500,
      "Something is wrong , while Registering new User in Database"
    );

  // 10.-----------------------------------------------------------------

  const createdUserDataFromDB = await User.findById(newUserObject._id).select(
    "-password -refreshToken"
  );

  if (!createdUserDataFromDB)
    throw new ApiError(500, "Server Down :: User is not created");

  // 11.-----------------------------------------------------------------

  return res.status(200).json(new ApiResponse(201, createdUserDataFromDB));
});

export { registerController };
