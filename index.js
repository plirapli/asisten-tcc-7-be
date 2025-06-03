import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://fe-7-vite-dot-asisten-tcc-a.as.r.appspot.com",
    ], // <- Diganti sama alamat front-end
    credentials: true,
  })
);
app.use(express.json());
app.use(UserRoute);

app.listen(port, () => console.log(`Server connected on port ${port}`));
