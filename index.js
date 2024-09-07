import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// file import
import connectDb from "./db/db.js";
import userRoute from "./routes/user.routes.js";
import categoryRoute from "./routes/category.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// ENV
dotenv.config();

// PORT
const PORT = process.env.PORT || 8000;

const app = express();

// Database
connectDb();

// cloud
// v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 404 Not Found");
});
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server on in ${PORT}`);
});
