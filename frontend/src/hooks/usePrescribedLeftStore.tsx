
import { create } from 'zustand';

type PrescribeLeftStoreType = {
    diagnosis: string[],
    symptoms: string[],
    pastHistory: string,
    addDiagnosis: (diagnosis: string) => void,
    removeDiagnosis: (diagnosis: string) => void,
    addSymptom: (symptom: string) => void,
    removeSymptom: (symptom: string) => void,
    changeHistory: (history: string) => void,
    reset: () => void,
    setAllInfo: (_diagnosisList: string[], _symptomsList:string[], _pastHistory:string) => void,
}

const usePrescribedLeftStore = create<PrescribeLeftStoreType>(set => (
    {
        diagnosis: [],
        symptoms: [],
        pastHistory: "",
        addDiagnosis : (diagnosis: string) => set(state => ({...state, diagnosis: [...state.diagnosis, diagnosis]})),
        removeDiagnosis: (diagnosis: string) => set(state => ({...state, diagnosis: state.diagnosis.filter(str => str !== diagnosis)})),
        changeHistory : (history) => set(state => ({...state, pastHistory: history})),
        addSymptom : (symptom: string) => set(state => ({...state, symptoms: [...state.symptoms, symptom]})),
        removeSymptom : (symptom: string) => set(state => ({...state, symptoms: state.symptoms.filter(item => item !== symptom)})),
        reset : () => set({diagnosis: [], symptoms: [], pastHistory: ''}),
        setAllInfo: (_diag, _symp, _past) => set(state => ({...state, diagnosis: _diag, symptoms: _symp, pastHistory: _past})),
    }
));

export default usePrescribedLeftStore;