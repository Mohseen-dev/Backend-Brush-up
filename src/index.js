// require('dotenv').config();  //! this Import Syntax add inconsistency in the code(my)
import dotenv from "dotenv";
dotenv.config({ path: "./env" }); //* we can also load environment variable in package.json via CLI flag in modern or new version of Node.js (above v20+)
import connectToDB from "./db/index.js";
import { app } from "./app.js";

connectToDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("server error :: src/index.js :: ", error.message);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is serving at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "mongoDb connection failer :: src/index.js :: ",
      error.message
    );
    process.exit(1);
  });
