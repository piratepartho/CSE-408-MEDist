// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";
import htmlPdf from "puppeteer-html-pdf";
import fs from "fs";
import ejs from "ejs";

// service instances
import {
  appointmentService,
  prescriptionService,
  prescription_medicineService,
} from "../services";

import createHttpError from "http-errors";
import log from "../utils/logger";
import {
  Create_Prescription_Body_Input,
  Create_Prescription_Params_Input,
} from "../schema/prescription.schema";
import {
  PrescriptionHeader,
  PrescriptionOutput,
  Prescription_Medicine_Input,
} from "../database/models";
import { CreatePrescriptionInput } from "../database/repository";
import path from "path";

export interface PrescriptionControllerInterface {
  //create prescription - access by doctor
  createPrescription(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  );

  //get prescription - access by all
  getPrescription(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  );

  // temporary method to test prescription header - access by all
  generatePrescriptionHeader(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  );

  printPrescription(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  );
}

class PrescriptionController implements PrescriptionControllerInterface {
  // temporary method to test prescription header
  async generatePrescriptionHeader(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);

    try {
      const prescriptionHeader: PrescriptionHeader =
        await prescriptionService.generatePrescriptionHeader(
          appointmentID,
          null
        );

      if (!prescriptionHeader) {
        throw createHttpError(500, "Error generating prescription header");
      }

      res.status(200).json(prescriptionHeader);
    } catch (error) {
      log.error(error);
      next(createHttpError(500, "Error generating prescription header"));
    }
  }

  // ----------------- Create Prescription ----------------- //
  async createPrescription(
    req: Request<
      Create_Prescription_Params_Input,
      {},
      Create_Prescription_Body_Input
    >,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);
    const doctorID = req.user_identity?.id as number;

    const createPrescriptionInput: CreatePrescriptionInput = {
      appointmentID,
      doctorID,

      medicines: req.body.medicines as Prescription_Medicine_Input[],

      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      advices: req.body.advices,
      meetAfter: req.body.meetAfter ? Number(req.body.meetAfter) : null,
      past_history: req.body.past_history || null,
      otherNotes: req.body.otherNotes || null,
      test: req.body.test || null,
    };

    log.info(createPrescriptionInput, "prescription creation input");

    try {
      const newPrescription: PrescriptionOutput =
        await prescriptionService.createPrescription(createPrescriptionInput);

      res.status(200).json(newPrescription);
    } catch (error) {
      log.error(error);
      next(createHttpError(500, "Error generating prescription header"));
    }
  }

  // ----------------- Get Prescription ----------------- //
  async getPrescription(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);

    try {
      const prescription: PrescriptionOutput =
        await prescriptionService.getPrescription(appointmentID);

      res.status(200).json(prescription);
    } catch (error) {
      next(createHttpError(500, "Error getting prescription"));
    }
  }

  // --------------- print prescription ----------------- //
  async printPrescription(
    req: Request<Create_Prescription_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);
    try {
      const downloadLink =
        await prescriptionService.getPrescriptionPDFDownloadLink(appointmentID);

      if (!downloadLink)
        throw createHttpError(500, "Error getting prescription download link");
      res.status(200).json({ downloadLink });
    } catch (error) {
      log.error(error);
      next(createHttpError(500, "Error getting prescription"));
    }
  }
}

export default new PrescriptionController();
