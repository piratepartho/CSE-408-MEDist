import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios  from "axios"

const fetchDownloadLink = async (input: {
  prescriptionId: number;
  authToken: string;
}) => {
  const navigate = useNavigate();
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/prescription/print-prescription/${input.prescriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${input.authToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  console.log(
    "🚀 ~ file: DoctorInfo.tsx:20 ~ getDoctorInfo ~ response:",
    response.data
  );
  navigate(-1);
  return response.data;
};

const DownlaodPrescription: FC = () => {
  const [cookies] = useCookies(["user"]);
  const { prescripitonId } = useParams();

  
  if (!prescripitonId) {
    return <div>No Such Prescrtiption</div>;
  }

  const { data, isLoading, isError} = useQuery({
    queryKey: ["getPDFDownlaodLink"],
    queryFn: () =>
      fetchDownloadLink({
        prescriptionId: +prescripitonId,
        authToken: cookies.user.token,
      }),
  });
  if(isLoading){
    <div className="flex justify-center"><LoadingSpinner/></div>
  }
  if(isError){
    <div>Error...</div>
  }
  return <Link to={data} target="_blank"/>;
};

export default DownlaodPrescription;
