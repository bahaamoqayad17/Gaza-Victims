import express, { Application } from "express";
const app: Application = express();
import morgan from "morgan";
import GlobalErrorHandler from "@/Controllers/ErrorHandler";
import cors from "cors";
import AppError from "@/Utils/AppError";
import path from "path";

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Note: The catch-all route will be added AFTER GraphQL middleware is applied in server.ts
// This prevents it from interfering with the /graphql endpoint

app.use(GlobalErrorHandler);

export default app;
