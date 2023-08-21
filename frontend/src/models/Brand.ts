// export interface Brand {
//   id: number;
//   name: string;
//   strength: string;
//   generic: string;
//   manufacturer: string;
//   dosage: {
//     type: string;
//     icon: string;
//   };
// }


export interface SearchBrandOutput {
  brandInfos: BrandInfo[];
  totalCount: number;
}

export interface SearchGenericOutput {
  genericInfos: AllGenericInfo[];
  totalCount: number;
}

export interface BrandInfo {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes;
  Generic: GenericAttributes;
  Manufacturer: ManufacturerAttributes;
  type? : "BrandInfo"
}
export interface BrandDescription {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes,
  Generic: GenericAttributes,
  Manufacturer: ManufacturerAttributes,
  Description: DescriptionAttributes,
};
export interface AllGenericInfo {
  Generic: GenericAttributes;
  availableBrands: number;
  type?: "AllGenericInfo"
}


//TODO: ask dhrubo for a discriminator or type flag to be added to proper check 



export interface GenericDescription {
  Generic: GenericAttributes;
  Description: GenericDescriptionAttributes;
  availableBrands: BrandInfo[];
}

export interface DosageFormAttributes {
  id: number;
  name: string;
  img_url: string;
}

export interface GenericAttributes {
  id: number;
  name: string;
  type: string;
}
export interface SingleManufacturerInfo {
  Manufacturer: ManufacturerAttributes;
  availableBrands: SearchBrandOutput;
}
export interface ManufacturerAttributes {
  id: number;
  name: string;
}

export interface BrandDescription extends BrandInfo {
  Description: DescriptionAttributes;
}

export interface DescriptionAttributes {
  id: number;
  unit_price: string | null;
  indications: string | null
  compositions: string | null;
  pharmacology: string | null;
  dosage_and_administration: string | null;
  interaction: string | null;
  contraindications: string | null;
  side_effects: string | null;
  pregnancy_and_lactation: string | null;
  precautions_and_warnings: string | null;
  overdose_effects: string | null;
  therapeutic_class: string | null;
  storage_conditions: string | null;
  createdAt ?: Date | null;
  updatedAt ?: Date | null;
}

export interface GenericDescriptionAttributes {
  id: number;
  indications: string | null
  compositions: string | null;
  pharmacology: string | null;
  dosage_and_administration: string | null;
  interaction: string | null;
  contraindications: string | null;
  side_effects: string | null;
  pregnancy_and_lactation: string | null;
  precautions_and_warnings: string | null;
  overdose_effects: string | null;
  therapeutic_class: string | null;
  storage_conditions: string | null;
  createdAt ?: Date | null;
  updatedAt ?: Date | null;
}
export function isSearchBrandOutput(object: any): object is SearchBrandOutput {
  // console.log(object);
  return (
    object.totalCount &&
    Array.isArray(object.brandInfos) &&
    object.brandInfos.every((item : BrandInfo) => {
      return item.Brand && item.DosageForm && item.Generic && item.Manufacturer;
    })
  );
}

export function isSearchGenericOutput(object:any) : object is SearchGenericOutput {
  return (
    object.totalCount && 
    Array.isArray(object.genericInfos) && object.genericInfos.every((item: AllGenericInfo) => {
      return item.Generic && item.availableBrands;
    })
  )
}

export interface DoctorSearchAttributes {
  img : string;
  name : string;
  degree : string;
  department : string;
  bmdcNumber : string;
  cost : number;
  contact : string;
}

export interface DoctorPendingAttributes {
  appID : string;
  name : string;
  date : Date;
  meetLink : string;
}

export interface PatientPendingAttributes {
  appID : string;
  name : string;
  date : Date;
  meetLink : string;
}

export interface DoctorAttributes {
  id: number;
  status: string;
  userID: number;

  // additional info
  image: string;
  name: string;
  email: string;
  phone: string;
  gendar: string;
  dob: Date;
  bmdc: string;
  issueDate: Date;
  degrees: string[];

  specializationID: number;
  scheduleID: number;
}
export interface SpecializationAttributes {
  id: number;
  name: string;
}

export interface DoctorAdditionalInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID"
  >;
  Specialization: SpecializationAttributes | {};
}

export interface DoctorOverviewInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID" | "status" | "dob" | "phone"
  >; // exclude userID, scheduleID, specializationID

  Specialization: SpecializationAttributes ;
}

export interface SearchDoctorInfo {
  Doctors: DoctorOverviewInfo[];
  totalCount: number;
}

export interface SingleDaySchedule {
  weekday: number;
  startTime: string;
  endTime: string;
  totalSlots: number;
}

export interface OnlineScheduleAttributes {
  id: number;
  visitFee: number;
  schedule: SingleDaySchedule[];
}

export interface DoctorProfileInfo {
  DoctorInfo: DoctorAttributes;
  Specialization: SpecializationAttributes ;
  OnlineSchedule: OnlineScheduleAttributes ;
}

export interface PendingAppointments {
  appointments: PendingAppointmentOverviewInfo[];
  totalCount: number;
}

export interface Patient_or_Doctor_Info {
  id: number;
  name: string;
  email: string;
}

export interface PendingAppointmentOverviewInfo {
  id: number;
  type: string;

  patientInfo: Patient_or_Doctor_Info | null;

  doctorInfo: Patient_or_Doctor_Info | null;

  startTime: string;
  endTime: string;

  status: string;

  meetingLink: string;
}