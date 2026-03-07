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
      return !field || field.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // 3.-----------------------------------------------------------------

  const isUserAlreadyExist = await User.findOne({
    $and: [{ userName }, { email }],
  });

  // 4.-----------------------------------------------------------------

  if (isUserAlreadyExist) throw new ApiError(400, "User already exist");

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
    req.files.avatar.length === 0 ||
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

const loginController = asynchandler(async (req, res) => {
  //! Algorithm
  //1. getting user information from frontend
  //2. validate these User's information , if empty return Error
  //3. search user in database with user's username and email coming from frontend, if not exist return Error
  //4. match user credential , if your credential does not match then return Error
  //5. generate AccessToken and refreshToken
  //6. generated refresh token add in database also
  //7. send these AccessToken and refreshToken to frontend as a cookie session
  //8. Return Ok response

  //! start

  // 1.-------------------------------------------------------------------

  const { userName, email, password, fullName } = req.body;
  // console.log(req);
  // console.log("checkPoint :: frontend data :: userName,email,password,fullName :: ",userName,email,password,fullName);

  // 2.-------------------------------------------------------------------

  if (
    [userName, email, password, fullName].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // 3.-------------------------------------------------------------------

  const isUserExist = await User.findOne({ $and: [{ userName }, { email }] });

  // 4.-------------------------------------------------------------------

  if (
    !isUserExist ||
    isUserExist.userName !== userName ||
    isUserExist.email !== email ||
    !(await isUserExist.isPasswordCorrect(password))
  )
    throw new ApiError(404, "User doesn't exits or Invalid Credentail");

  // 5.-------------------------------------------------------------------

  const accessToken = await isUserExist.generateAccessToken();
  const refreshToken = await isUserExist.generateRefreshToken();
  // console.log("accessToken :: ", accessToken);
  // console.log("refreshToken :: ", refreshToken);

  //6.-------------------------------------------------------------------

  isUserExist.refreshToken = refreshToken;

  // 7.-------------------------------------------------------------------

  const userDetailForFrontend = await isUserExist
    .save({
      validateBeforeSave: false,
    })
    .then((state) => {
      const data = state.toObject();
      delete data["password"];
      data.accessToken = accessToken;
      data.refreshToken = refreshToken;
      return data;
    });

  // 8.-------------------------------------------------------------------

  const cookieOptions = {
    httpOnly: true, // Prevents JS from accessing the cookie (secure)
    secure: true, // Only sent over HTTPS
    sameSite: "strict", // Prevents CSRF attacks
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        202,
        userDetailForFrontend,
        "Successfully login and set cookies"
      )
    );
});

export { registerController, loginController };
