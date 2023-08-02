// import 'bootstrap/dist/css/bootstrap.min.css';
import { FC } from "react";
import SearchMed from "./SearchMed";
import MedCard from "./MedCard";
import { Brand } from "@/models/Brand";
import MedCards from "./MedCards";
import Cardpage from "./Cardspage";


const medicineList : Brand[] = [
  { id: 1, name: "Napa", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
  { id: 2, name: "Napa", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
  { id: 3, name: "Napa", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
  { id: 4, name: "Napa", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
  { id: 5, name: "Napa Extra", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
  { id: 6, name: "Napa Extend", strength: "500mg", generic: "Paracetamol", manufacturer: "Beximco Pharama", dosage: {type: "Suppository", icon: "dummy"}},
]

const MedicineSearchPage: FC = () => {
  return <div className="py-3">
    <p className="flex justify-center font-bold text-2xl">Search Medicine</p>
    <SearchMed/>
    <Cardpage medicineList={medicineList}/>
  </div>;
};

export default MedicineSearchPage;
