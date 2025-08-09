import express, { Application } from "express";
const app: Application = express();
import morgan from "morgan";
import GlobalErrorHandler from "@/Controllers/ErrorHandler";
import cors from "cors";
import path from "path";

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use(GlobalErrorHandler);

export default app;
