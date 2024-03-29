// external imports
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

// internal imports
import log from "./utils/logger";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function middlewares(req, res, next) {
  log.info(
    " ================== New Request Received ========================== "
  );
  log.info(req.body, "request body");
  log.info(req, "request");
  log.info(
    " =================== End of Request info ========================== "
  );
  next();
}
app.use("/api/auth", middlewares, proxy("http://localhost:3001"));
app.use("/api/medicine", middlewares, proxy("http://localhost:3002"));
app.use("/api/patient", middlewares, proxy("http://localhost:3003"));
app.use("/api/doctor", middlewares, proxy("http://localhost:3004"));
app.use("/api/appointment", middlewares, proxy("http://localhost:3005"));

app.use(notFoundHandler);
app.use(defaultErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  log.info(`Server running at http://localhost:${PORT}`);
});
