import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/Users.model.js";
export const verifyTokenOrUser = async (req, _, next) => {
  //(req,res,next)
  //! Algorithm

  // 1. getting cookie from req.cookie (i.e get Token)
  // 2. if token doesn't exit , return Error
  // 3. decode Token and extract information inside token using jwt.verify method
  // 4. using decodedToken's information and getting User detail except passward and refreshToken from DB
  // 5. if User doesn't exit , return Error
  // 6. Now , add new object into ""req""
  // 7. next()

  //! start

  // 1.
  //   console.log(req.headers)
  const tokenFromCookies =
    req.cookies?.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  console.log("token :: ", tokenFromCookies);

  // 2.
  if (!tokenFromCookies)
    throw new ApiError(401, "Unauthorized request: No token found");

  // 3.
  const informationFromToken = jwt.verify(
    tokenFromCookies,
    process.env.ACCESS_TOKEN_SECRET
  );
  // 4.
  const userFromDB = await User.findById(informationFromToken._id).select(
    "-password -refreshToken"
  );

  // 5.
  if (!userFromDB) throw new Api(404, "User does not exist");

  // 6.
  req.loggindUser = userFromDB;

  // 7.
  next();
};
