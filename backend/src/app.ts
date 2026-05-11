import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.MOBILE_ORIGIN === "*" ? true : env.MOBILE_ORIGIN,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "wwu-backend" });
});

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);
