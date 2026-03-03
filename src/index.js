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
