import NavBar from "./components/customUI/NavBar";
import { navIcon } from "./models/navIcon";
import MedicineDescriptionPage from "./pages/Medicines/Medicine/MedicineDescriptionPage";
import MedicineSearchPage from "./pages/Medicines/SearchMedicines/MedicineSearchPage";
import { Routes, Route, Navigate } from "react-router-dom";
import GenericDescriptionPage from "./pages/Medicines/Generic/GenericDescriptionPage";
import ManufacturerDescriptionPage from "./pages/Medicines/Manufacturer/ManufacturerPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import {DoctorInfo} from "./pages/doctor/DoctorInfo";
import DoctorImage from "./pages/doctor/DoctorImage";


const navList: navIcon[] = [
  { name: "Medicines", link: "/medicines" },
  { name: "Prescriptions", link: "/prescriptions" },
  { name: "Appointments", link: "/appointments" },
  { name: "Account", link: "/account" },
  { name: "Logout", link: "/logout" }, // TODO: add a logout icon insted of this
];

function App() {
  return (
    <>
      {/* <NavBar navList={navList}/> */}
      <Routes>
        <Route path="/landing" element={<LoginPage/>}/>
        <Route path="*" element={<Navigate to="/searchMedicines/" replace />} />
        <Route  element={<NavBar navList={navList} />}>
          {/* <Route index element={<NavBar navList={navList} />} /> */}
          <Route path="searchMedicines/" element={<MedicineSearchPage />}/>
          <Route path="medicine/:medicineId" element={<MedicineDescriptionPage/>}/>
          <Route path="generic/:genericId" element={<GenericDescriptionPage/>} />
          <Route path="manufacturer/:manufacturerId" element={<ManufacturerDescriptionPage/>} />
          <Route path="doctor/info" element={<DoctorImage/>}/>
        </Route>
        
      </Routes>
      {/* <NavBar navList={navList} />
      <SearchMed />
      <GenericList genericList={genericList} /> */}
    </>
  );
}

export default App;
