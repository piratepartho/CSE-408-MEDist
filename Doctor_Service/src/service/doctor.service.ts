// external imports
import createHttpError from "http-errors";

// internal imports
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

import {
  DoctorAdditionalInfo,
  DoctorAdditionalInfo_Excluded_Properties,
  DoctorAttributes,
  DoctorOverviewInfo,
  DoctorOverviewInfo_Excluded_Properties,
  DoctorProfileInfo,
  DoctorProfileInfo_Excluded_Properties,
  PrescriptionDoctorInfo_Excluded_Properties,
  SearchDoctorInfo,
} from "../database/models/Doctor.model";

import { excludeProperties } from "../utils/necessary_functions";

// import models
import { Doctor } from "../database/models";

// repository instance
import { doctorRepository } from "../database/repository";
import { searchQuery_and_Params } from "../database/repository/doctor.repository";
import log from "../utils/logger";
import { OnlineSchedule_Excluded_Properties } from "../database/models";
import online_scheduleService from "./online_schedule.service";

export interface DoctorServiceInterface {
  // during registration and login
  createInitialDoctor(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  getEmailandName_givenID(doctorID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;

  // after registration and login
  getDoctorAdditionalInfo(doctorID: number): Promise<DoctorAdditionalInfo>;
  updateDoctorAdditionalInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorAdditionalInfo>;

  addDoctorOnlineFee(doctorId, newFee): Promise<boolean>;
  updateDoctorOnlineFee(doctorId, newFee): Promise<boolean>;

  // after full registration
  getDoctorOverviewInfo(doctorID: number): Promise<DoctorOverviewInfo>;
  getDoctorProfileInfo(doctorID: number): Promise<DoctorProfileInfo>;

  // search doctor
  searchDoctor(searchInfo: searchQuery_and_Params): Promise<SearchDoctorInfo>;
}

class DoctorService implements DoctorServiceInterface {
  // ----------------- during registration and login -----------------
  async createInitialDoctor(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: doctorID, status: profile_status } =
        await doctorRepository.createDoctor_byUserId(userID);

      return {
        status: "success",
        data: {
          ID: doctorID,
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

  async getId_givenUserID(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: doctorID, status: profile_status } =
        await doctorRepository.getId_givenUserID(userID);

      if (isNaN(doctorID)) {
        return {
          status: "not_found",
          data: {},
        };
      }

      return {
        status: "success",
        data: {
          ID: doctorID,
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

  async getEmailandName_givenID(
    doctorID: number
  ): Promise<RPC_Response_Payload> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      return {
        status: "success",
        data: {
          email: doctor.email,
          name: doctor.name,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // ----------------- get prescription doctor info -----------------
  async getPrescriptionDoctorInfo(
    doctorID: number
  ): Promise<RPC_Response_Payload> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      if (!doctor) throw new Error("Doctor not found");

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        PrescriptionDoctorInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      if (!specialization) throw new Error("Specialization not found");

      return {
        status: "success",
        data: {
          DoctorInfo: doctorInfo,
          Specialization: specialization.dataValues,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // ----------------- server side RPC request handler ----------------
  async serveRPCRequest(
    payload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };
    log.info(payload, "received payload");
    switch (payload.type) {
      case "CREATE_NEW_ENTITY":
        return await this.createInitialDoctor(payload.data["userID"]);

      case "GET_ID":
        return await this.getId_givenUserID(payload.data["userID"]);

      case "GET_EMAIL_AND_NAME_FROM_ID":
        return await this.getEmailandName_givenID(
          Number(payload.data["doctorID"])
        );

      case "GET_SCHEDULE_INFO_FROM_ID":
        return await online_scheduleService.giveScheduleInfo(
          Number(payload.data["scheduleID"])
        );

      case "GET_DOCTOR_INFO_FOR_PRESCRIPTION":
        return await this.getPrescriptionDoctorInfo(
          Number(payload.data["doctorID"])
        );

      default:
        return response;
    }
  }

  // ----------------- after registration and login -----------------

  async getDoctorAdditionalInfo(
    doctorID: number
  ): Promise<DoctorAdditionalInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorAdditionalInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDoctorAdditionalInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorAdditionalInfo> {
    try {
      if (newDoctorInfo.id) delete newDoctorInfo.id;
      if (newDoctorInfo.userID) delete newDoctorInfo.userID;
      if (newDoctorInfo.status) delete newDoctorInfo.status;

      const doctor = await doctorRepository.updateDoctorAdditionalInfo(
        doctorID,
        newDoctorInfo
      );

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorAdditionalInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- add doctor online fee -----------------
  async addDoctorOnlineFee(doctorId, newFee): Promise<boolean> {
    try {
      return await doctorRepository.addDoctorOnlineFee(doctorId, newFee);
    } catch (error) {
      throw error;
    }
  }

  // ----------------- update doctor online fee -----------------
  async updateDoctorOnlineFee(doctorId, newFee): Promise<boolean> {
    try {
      return await doctorRepository.updateDoctorOnlineFee(doctorId, newFee);
    } catch (error) {
      throw error;
    }
  }

  // ----------------- after full registration -----------------

  // get doctor's overview info
  async getDoctorOverviewInfo(doctorID: number): Promise<DoctorOverviewInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorOverviewInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  // get doctor's profile info
  async getDoctorProfileInfo(doctorID: number): Promise<DoctorProfileInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      const specialization = await doctor.getSpecialization();
      const onlineSchedules = await doctor.getOnlineSchedules();

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorProfileInfo_Excluded_Properties
      );

      const onlineSchedulesInfo = onlineSchedules.map((schedule) => {
        return excludeProperties(
          schedule.dataValues,
          OnlineSchedule_Excluded_Properties
        );
      });

      //sort ascending order by weekday
      onlineSchedulesInfo.sort((a, b) => {
        return a.weekday - b.weekday;
      });

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
        OnlineSchedule: {
          visit_fee: doctor.online_visit_fee,
          schedules: onlineSchedulesInfo,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- search doctor -----------------
  async searchDoctor(
    searchInfo: searchQuery_and_Params
  ): Promise<SearchDoctorInfo> {
    try {
      const { doctors, totalCount } = await doctorRepository.searchDoctor(
        searchInfo
      );

      const doctorOverviews = await doctors.map(async (doctor) => {
        const doctorInfo = excludeProperties(
          doctor.dataValues,
          DoctorOverviewInfo_Excluded_Properties
        );

        const specialization = await doctor.getSpecialization();

        return {
          DoctorInfo: doctorInfo,
          Specialization: specialization?.dataValues || {},
        };
      });

      return {
        Doctors: await Promise.all(doctorOverviews),
        totalCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorService();
