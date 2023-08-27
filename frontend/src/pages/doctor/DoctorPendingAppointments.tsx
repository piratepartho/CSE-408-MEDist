import { FC, useState } from "react";
// import SearchDoctor from "./SearchDoctor";
import { PatientSearchForm } from "@/models/FormSchema";
import { z } from "zod";
// import DoctorSearchCards from "./DoctorSearchCards";
import DoctorPendingCards from "./DoctorPendingCards";

const PatientSearchPage: FC = (props) => {
  const [searchFormData, setSearchFormData] = useState<
    z.infer<typeof PatientSearchForm>
  >({ name: "", });
  const updateFormData = (formData: z.infer<typeof PatientSearchForm>): void => {
    setSearchFormData(formData);
    console.log("here",searchFormData);
  };
  const [searchTab, setSearchTab] = useState(false);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const data=[
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
  ]
  const pendingAppointments=[
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
  ]
  return (
    <div className="m-3">
      <div className="text-sm font-medium text-center text-c1 border-b border-gray-200 dark:text-gray-400 dark:border-c2">
        
        {!searchTab && (
          <div>
            <ul className="flex flex-wrap justify-center -mb-px">
              <li className="mr-2">
                <a
                //   onClick={() => {
                //     setSearchTab(true);
                //   }}
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-c2 hover:border-gray-300 dark:hover:text-c2"
                  
                >
                  Search Previous
                </a>
              </li>
              <li className="mr-2">
                <a
                  className="inline-block p-4 text-c1 border-b-2 border-gray-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                  aria-current="page"
                >
                  Pending Appointments
                </a>
              </li>
            </ul>
            <DoctorPendingCards patientFetchedData={pendingAppointments} currentPage={currentPendingPage} setCurrentPage={setCurrentPendingPage}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSearchPage;
