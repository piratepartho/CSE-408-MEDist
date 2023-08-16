import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { DoctorOnlineScheduleForm } from "@/models/FormSchema";

export const AddSchedule: FC = () => {
  const forms = useForm<z.infer<typeof DoctorOnlineScheduleForm>>({
    defaultValues: {},
    resolver: zodResolver(DoctorOnlineScheduleForm),
  });
  //   const onSubmit: SubmitHandler<z.infer<typeof DoctorOnlineScheduleForm>> = (
  //     data
  //   ) => {
  //     console.log(data);
  //   };

  const [Saturday, setSaturday] = useState(false);
  const [Sunday, setSunday] = useState(false);
  const [Monday, setMonday] = useState(false);
  const [Tuesday, setTuesday] = useState(false);
  const [Wednesday, setWednesday] = useState(false);
  const [Thursday, setThursday] = useState(false);
  const [Friday, setFriday] = useState(false);
  const [SatStart, setSatStart] = useState("00:00:00");
  const [SatEnd, setSatEnd] = useState("");
  const [SunStart, setSunStart] = useState("00:00");
  const [SunEnd, setSunEnd] = useState("");
  const [MonStart, setMonStart] = useState("");
  const [MonEnd, setMonEnd] = useState("");
  const [TueStart, setTueStart] = useState("");
  const [TueEnd, setTueEnd] = useState("");
  const [WedStart, setWedStart] = useState("");
  const [WedEnd, setWedEnd] = useState("");
  const [ThuStart, setThuStart] = useState("");
  const [ThuEnd, setThuEnd] = useState("");
  const [FriStart, setFriStart] = useState("");
  const [FriEnd, setFriEnd] = useState("");
  const [SatSlots, setSatSlots] = useState("");
  const [SunSlots, setSunSlots] = useState("");
  const [MonSlots, setMonSlots] = useState("");
  const [TueSlots, setTueSlots] = useState("");
  const [WedSlots, setWedSlots] = useState("");
  const [ThuSlots, setThuSlots] = useState("");
  const [FriSlots, setFriSlots] = useState("");
  const [contact, setContact] = useState("");
  const [cost, setCost] = useState("");

  const values = {
    contact: contact,
    cost: cost,
    days: [
      Saturday ? { startTime: SatStart, endTime: SatEnd, slot: SatSlots } : {},
      Sunday ? { startTime: SunStart, endTime: SunEnd, slot: SunSlots } : {},
      Monday ? { startTime: MonStart, endTime: MonEnd, slot: MonSlots } : {},
      Tuesday ? { startTime: TueStart, endTime: TueEnd, slot: TueSlots } : {},
      Wednesday ? { startTime: WedStart, endTime: WedEnd, slot: WedSlots } : {},
      Thursday ? { startTime: ThuStart, endTime: ThuEnd, slot: ThuSlots } : {},
      Friday ? { startTime: FriStart, endTime: FriEnd, slot: FriSlots } : {},
    ],
  };

  const onSubmit: () => void = () => {
    console.log(values);
  };

  return (
    <>
      <div className="flex text-c1 text-large font-bold justify-center mt-6">
        Edit Online Clinic
      </div>
      {/* <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex flex-col w-screen justify-start gap-5 ml-6"
      >
        <div className="flex">
          <div className="flex-[40%] flex flex-col gap-5">
            <div className="flex gap-3">
              Contact Number :
              <Controller
                name="contact"
                control={forms.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="text"
                    className="flex w-42"
                    placeholder="Enter Contact Number"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
            <div className="flex gap-3">
              Cost :
              <Controller
                name="cost"
                control={forms.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="text"
                    className="flex w-42"
                    placeholder="Enter Cost"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>
          {/* <div className="flex-[60%] flex flex-col gap-5">
            Edit Schedule
            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                Days :
                <Controller
                  name="days"
                  // days is an array of objects containing day,time and slots
                  control={forms.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <Input
                          type="checkbox"
                          id="Saturday"
                          onChange={() => setSaturday(!Saturday)}
                        >
                          Saturday
                        </Input>
                      </div>
                    </div>
                    // <Input></>
                  )}
                />
              </div>
            </div>
          </div> */}
      {/* </div>
  </form> */}
      <div className="flex flex-col ml-6 mt-5 gap-5">
        <div className="flex gap-3">
          Contact Number :
          <Input
            type="text"
            className="flex w-42"
            placeholder="Enter Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          Cost :
          <Input
            type="text"
            className="flex w-42"
            placeholder="Enter Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-[60%] flex flex-col ml-6 mt-5 gap-5">
        Edit Schedule
        <div className="grid grid-cols-4 gap-4">
          <div>
            <input
              id="sat"
              type="checkbox"
              checked={Saturday}
              onChange={() => setSaturday(!Saturday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="sat"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Sat
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SatStart}
              disabled={!Saturday}
              onChange={(e) => {
                setSatStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SatEnd}
              disabled={!Saturday}
              onChange={(e) => {
                setSatEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={SatSlots}
              disabled={!Saturday}
              onChange={(e) => {
                setSatSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="sun"
              type="checkbox"
              checked={Sunday}
              onChange={() => setSunday(!Sunday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="sun"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Sun
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SunStart}
              disabled={!Sunday}
              onChange={(e) => {
                setSunStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SunEnd}
              disabled={!Sunday}
              onChange={(e) => {
                setSunEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={SunSlots}
              disabled={!Sunday}
              onChange={(e) => {
                setSunSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="mon"
              type="checkbox"
              checked={Monday}
              onChange={() => setMonday(!Monday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="mon"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Mon
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={MonStart}
              disabled={!Monday}
              onChange={(e) => {
                setMonStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={MonEnd}
              disabled={!Monday}
              onChange={(e) => {
                setMonEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={MonSlots}
              disabled={!Monday}
              onChange={(e) => {
                setMonSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="tue"
              type="checkbox"
              checked={Tuesday}
              onChange={() => setTuesday(!Tuesday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="tue"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Tue
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={TueStart}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={TueEnd}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={TueSlots}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="wed"
              type="checkbox"
              checked={Wednesday}
              onChange={() => setWednesday(!Wednesday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="wed"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Wed
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={WedStart}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={WedEnd}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={WedSlots}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="thu"
              type="checkbox"
              checked={Thursday}
              onChange={() => setThursday(!Thursday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="thu"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Thu
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={ThuStart}
              disabled={!Thursday}
              onChange={(e) => {
                setThuStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={ThuEnd}
              disabled={!Thursday}
              onChange={(e) => {
                setThuEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={ThuSlots}
              disabled={!Thursday}
              onChange={(e) => {
                setThuSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="fri"
              type="checkbox"
              checked={Friday}
              onChange={() => setFriday(!Friday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="fri"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Fri
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={FriStart}
              disabled={!Friday}
              onChange={(e) => {
                setFriStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={FriEnd}
              disabled={!Friday}
              onChange={(e) => {
                setFriEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={FriSlots}
              disabled={!Friday}
              onChange={(e) => {
                setFriSlots(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* button */}
        <div className="flex justify-center mt-5">
            <Button
                className="flex bg-c2 justify-center w-42 h-10 text-white rounded-lg hover:bg-c1"
                onClick={() => onSubmit()}
            >
                Save
            </Button>
        </div>
    </>
  );
};
export default AddSchedule;