// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

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
  Prescription_Medicine_Input,
} from "../database/models";
import { CreatePrescriptionInput } from "../database/repository";

export interface PrescriptionControllerInterface {
  //create prescription - access by doctor
  createPrescription(
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

      medicines: req.body.medicines as Prescription_Medicine_Input[],

      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      advices: req.body.advices,
      followUpDate: req.body.followUpDate
        ? new Date(req.body.followUpDate)
        : null,

      otherNotes: req.body.otherNotes || null,
    };

    log.info(createPrescriptionInput, "prescription creation input");

    try {
      /* const prescriptionHeader: PrescriptionHeader =
        await prescriptionService.generatePrescriptionHeader(
          appointmentID,
          null
        );

      if (!prescriptionHeader) {
        throw createHttpError(500, "Error generating prescription header");
      } */

      res.status(200).json(createPrescriptionInput);
    } catch (error) {
      log.error(error);
      next(createHttpError(500, "Error generating prescription header"));
    }
  }
}

export default new PrescriptionController();
