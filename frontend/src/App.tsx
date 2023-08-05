import NavBar from "./components/customUI/NavBar";
import { navIcon } from "./models/navIcon";
import MedicineDescriptionPage from "./pages/Medicines/Description/MedicineDescriptionPage";
import MedicineSearchPage from "./pages/Medicines/Search/MedicineSearchPage";
import SearchMed from "./pages/Medicines/Search/SearchMed";
import GenericList from "./pages/Medicines/Search/GenericList";
import { Routes, Route, Navigate } from "react-router-dom";

const availableBrands=[
  
]
const genericList = [
  {
    id: 2,
    name: "Genericfsdf sdfsdfsdfdsjjjjjjfffffffffffffffffgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggfffffkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk2",
    description: "Generic 12 description",
    type: "Generic",
    availableBrands: 12,
  },
  {
    id: 1,
    name: "Generic 1",
    description: "Generic 1 description",
    type: "Generic",
    availableBrands: 22,
  },
  {
    id: 3,
    name: "Generic 3",
    description: "Generic 3 description",
    type: "Generic",
    availableBrands: 32,
  },
];

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
      <NavBar navList={navList}/>
      <Routes>
        <Route path="*" element={<Navigate to="/searchMedicines/" replace />} />
        <Route path="searchMedicines/" element={<MedicineSearchPage />}/>
        <Route path="medicine/:medicineId" element={<MedicineDescriptionPage/>}/>
        <Route path="generic/:genericId" element={<>No page found</>} />
        <Route path="manufacturer/:manufacturerId" element={<>Manu page not found</>} />
      </Routes>
      {/* <NavBar navList={navList} />
      <SearchMed />
      <GenericList genericList={genericList} /> */}
    </>
  );
}

export default App;
