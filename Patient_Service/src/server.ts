//external imports
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

//internal imports
import log from "./utils/logger";
import router from "./routes/index";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

// database
import dbInit from "./database/init";
import { config } from "./config";
dbInit();

// message broker
import messageBroker from "./utils/broker";
import patientService from "./services/patient.service";
messageBroker.RPC_Observer(patientService);

const app = express();

// pre-route middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use(router);

// 404 error handler
app.use(notFoundHandler);

// default error handler
app.use(defaultErrorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  log.info(`Server running at http://localhost:${PORT}`);
});
