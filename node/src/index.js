import express from "express";
import cors from "cors";
import { router } from "./routes/users.js";
import mongoose from "mongoose";
import { routerCategory } from "./routes/category.js";
import routerOrder from "./routes/order.js";
import routerFood from "./routes/foods.js";

const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://fooddd-228k.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming origin:", origin);

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin?.includes("vercel.app")) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/users", router);
app.use("/foods", routerFood);
app.use("/order", routerOrder);
app.use("/category", routerCategory);

mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://sunduibzrr:sunduibzrr@cluster0.u5fuyce.mongodb.net/test",
  )
  .then(() => console.log("connected!"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
