// ! use only one syntax or version
//* this is Promise Version
const asynchandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};
export {asynchandler}

//* this is tryCatch Version syntax

// const asyncFunctionWrapper = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message });
//   }
// };
