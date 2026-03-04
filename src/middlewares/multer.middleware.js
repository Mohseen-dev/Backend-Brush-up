import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}-${Date.now()}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
