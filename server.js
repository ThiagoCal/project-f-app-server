import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/User.js";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();
const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    path.extname(file.originalname).toLocaleLowerCase() === ".jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post("/uploadimg", upload.single("image"), (req, res) => {
  console.log("upload.storage.filename", req.file.filename);
  try {
    const value = { ...req.body, filename: req.file.filename };
    console.log(value);
    res.status(200).json({ msg: "File uploaded", filename: value.filename });
  } catch (error) {
    res.status(500).json({ msg: "Error uploading image" });
    console.log(error);
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
