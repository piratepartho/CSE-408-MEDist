// external imports
import createHttpError from "http-errors";

//internal imports
import patientRepository, {
  PatientRepositoryInterface,
} from "../database/repository/patient.repository";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import { config } from "../config";
import Patient, {
  PatientAdditionalInfo,
  PatientAdditionalInfo_Excluded_Properties,
  PatientOverviewInfo,
  PatientOverviewInfo_Excluded_Properties,
  Patient_Info_For_Prescription,
  UpdatedPatientAdditionalInfo,
} from "../database/models/Patient.model";
import log from "../utils/logger";
import { excludeProperties } from "../utils/necessary_functions";

export interface PatientServiceInterface {
  createInitialPatient(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  getName_givenID(patientID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;

  //get patient info
  getPatientInfo(patientID: number): Promise<Patient>;

  //get patient additional info
  getPatientAdditionalInfo(
    patientID: number
  ): Promise<UpdatedPatientAdditionalInfo>;

  //get patient overview info
  getPatientOverviewInfo(patientID: number): Promise<PatientOverviewInfo>;

  //update patient info
  updatePatientAdditionalInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<UpdatedPatientAdditionalInfo>;
}

class PatientService implements PatientServiceInterface {
  private repository: PatientRepositoryInterface;

  constructor() {
    this.repository = patientRepository;
  }

  // ----------------------------------------- Create Initial Patient ------------------------------------------ //
  async createInitialPatient(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: patientID, status: profile_status } =
        await this.repository.createPatient_byUserId(userID);

      return {
        status: "success",
        data: {
          ID: patientID,
          profile_status,
        },
      };
    } catch (error) {
      return {
        status: "duplicate_error",
        data: {},
      };
    }
  }

  // ----------------------------------------- Get ID given UserID ------------------------------------------ //
  async getId_givenUserID(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id, status } = await this.repository.getId_givenUserID(userID);

      const patientID = id;
      const profile_status = status;

      if (isNaN(patientID)) {
        return {
          status: "not_found",
          data: {},
        };
      }

      return {
        status: "success",
        data: {
          ID: patientID,
          profile_status,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // ----------------------------------------- Get Name given ID ------------------------------------------ //
  async getName_givenID(patientID: number): Promise<RPC_Response_Payload> {
    try {
      const patient = await this.repository.getPatientInfo(patientID);

      return {
        status: "success",
        data: {
          name: patient.name,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // ----------------------------------------- Get Patient Info for Prescription ------------------------------------------ //
  async getPatientInfo_forPrescription(
    patientID: number
  ): Promise<RPC_Response_Payload> {
    try {
      const patientInfo = (await this.getPatientAdditionalInfo(patientID))
        .PatientInfo;

      if (!patientInfo) throw createHttpError(404, "Patient not found");

      // remove status from patientInfo
      const { status, address, dob, ...rest } = patientInfo;

      log.info(rest, "patient info for prescription");

      // if (rest["updatedAt"]) delete rest["updatedAt"];
      // if (rest["createdAt"]) delete rest["createdAt"];

      // calculate age from dob
      const oneYear = 365.25 * 24 * 60 * 60 * 1000;
      const age = Math.floor((Date.now() - dob.getTime()) / oneYear);

      const resultData: Patient_Info_For_Prescription = {
        ...rest,
        age,
      };

      return {
        status: "success",
        data: {
          resultData,
        },
      };
    } catch (error) {
      log.error(error);
      return {
        status: "error",
        data: {
          message: error.message,
        },
      };
    }
  }

  // ----------------- server side RPC request handler ----------------
  async serveRPCRequest(payload: RPC_Request_Payload) {
    log.debug(payload, "Rpc request payload");
    console.log(payload, "Rpc request payload");
    let response: RPC_Response_Payload = {
      status: "error",
      data: {
        message: `request you sent - ${
          payload.type
        } - is not handled by the server & your data is - ${JSON.stringify(
          payload.data
        )}`,
      },
    };
    switch (payload.type) {
      case "CREATE_NEW_ENTITY":
        return await this.createInitialPatient(payload.data["userID"]);

      case "GET_ID":
        return await this.getId_givenUserID(payload.data["userID"]);

      case "GET_NAME_FROM_ID":
        return await this.getName_givenID(payload.data["patientID"]);

      case "GET_PATIENT_INFO_FOR_PRESCRIPTION":
        return await this.getPatientInfo_forPrescription(
          payload.data["patientID"]
        );

      default:
        break;
    }

    return response;
  }

  // ----------------------------------------- Get Patient Info ------------------------------------------ //
  async getPatientInfo(patientID: number): Promise<Patient> {
    try {
      const patient = await patientRepository.getPatientInfo(patientID);

      return patient;
    } catch (error) {
      throw error;
    }
  }

  async getPatientOverviewInfo(
    patientID: number
  ): Promise<PatientOverviewInfo> {
    try {
      const patient = await patientRepository.getPatientInfo(patientID);

      const patientOverviewInfo = excludeProperties(
        patient.dataValues,
        PatientOverviewInfo_Excluded_Properties
      );

      return {
        PatientInfo: patientOverviewInfo,
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------- Get Patient Additional Info ------------------------------------------ //
  async getPatientAdditionalInfo(
    patientID: number
  ): Promise<UpdatedPatientAdditionalInfo> {
    try {
      const patient = await patientRepository.getPatientInfo(patientID);

      const patientAdditionalInfo = excludeProperties(
        patient.dataValues,
        PatientAdditionalInfo_Excluded_Properties
      );

      const height = patientAdditionalInfo.height;
      // feet is simply the integer part of height
      const feet = Math.floor(height);
      // inches is the decimal part of height
      let inches = height - feet;
      // convert inches to integer
      inches = Math.round(inches * 100);

      const updatedPatientAdditionalInfo = {
        ...patientAdditionalInfo,
        height: {
          feet,
          inches,
        },
      };

      return {
        PatientInfo: updatedPatientAdditionalInfo,
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------- Update Patient Info ------------------------------------------ //
  async updatePatientAdditionalInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<UpdatedPatientAdditionalInfo> {
    try {
      // if newPatientInfo contains id, userID, status remove them
      if (newPatientInfo.id) delete newPatientInfo.id;
      if (newPatientInfo.userID) delete newPatientInfo.userID;
      if (newPatientInfo.status) delete newPatientInfo.status;

      const patient = await patientRepository.updatePatientAdditionalInfo(
        patientID,
        newPatientInfo
      );

      return await this.getPatientAdditionalInfo(patientID);
    } catch (error) {
      throw error;
    }
  }
}

export default new PatientService();
