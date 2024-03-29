//external imports
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

//internal imports
import log from "./utils/logger";
import router from "./routes/index";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";
import { config } from "./config";

// database
import dbInit from "./database/init";
dbInit();

//message broker
import messageBroker from "./utils/broker";
import { appointmentService } from "./services";
messageBroker.RPC_Observer(appointmentService); 

const app = express();

// pre-route middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pdfTemplate"));

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
