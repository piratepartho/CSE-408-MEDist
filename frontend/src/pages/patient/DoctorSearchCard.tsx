import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {FontAwesomeIcon} from "react-icons/fa"

import { DoctorSearchAttributes } from "@/models/Brand";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const DoctorSearchCard: FC<{ doctor: DoctorSearchAttributes }> = (props) => {
  return (
    <Card className="flex flex-col drop-shadow-lg overflow-hidden">
      <CardContent>
        <div className="flex">
          <div className="flex flex-[80%]">
            <div className="flex">
              <img
                src={props.doctor.img}
                className="mt-2 h-24 w-24"
                placeholder="img_404"
              />
              <div className="flex flex-col ml-6 ">
                <div className="text-c1  text-2xl flex justify-start font-bold gap-2">
                  {props.doctor.name}
                </div>
                <div className="text-c2 text-xl flex justify-start">
                  {props.doctor.degree}
                </div>
                <div className="text-c2 text-xl flex justify-start">
                  {props.doctor.department}
                </div>
                <div className="text-c2 text-xl flex justify-start">
                  BMDC : {props.doctor.bmdcNumber}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-[20%]">
            <div className="flex flex-col">
              <div className="text-c1 text-xl font-bold">
                Cost : {props.doctor.cost} Taka
              </div>
              <div className="text-c1 text-xl font-bold">
                Contact : {props.doctor.contact}
              </div>
              <Button className="bg-c2 w-42 text-white rounded-lg hover:bg-c1 mt-5">
                <Link to={`/patient/bookAppointment/`}>
                  Book An Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default DoctorSearchCard;
