import { GetPendingAppointments } from "@/models/Appointment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DoctorPendingCards from "./DoctorAppoinmentsCards";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";

const fetchPendingAppointments = async (
  authToken: string,
  currentPage: number
): Promise<GetPendingAppointments> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/view-appointments/${currentPage}?status=prescribed`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: DoctorPendingAppointments.tsx:16 ~ fetchPendingAppointments ~ response:",
    response.data
  );
  return response.data;
};

const DoctorPreviousAppList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cookies] = useCookies(["user"]);
  const { data, isLoading, isError, mutate } = useMutation({
    mutationKey: ["getPreviousAppointments"],
    mutationFn: () => fetchPendingAppointments(cookies.user.token, currentPage),
  });

  useEffect(() => {
    mutate();
  }, [currentPage, mutate]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError) 
    return <>Error</>;
  
  if (data)
    return (
      <div>
        {data.appointments && data.appointments.length > 0 && (
          <DoctorPendingCards
            patientFetchedData={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        {(!data.appointments || data.appointments.length === 0) && (
          <p className="text-center">No pending appointments</p>
        )}
      </div>
    );
  
    return <></>
};
export default DoctorPreviousAppList;
