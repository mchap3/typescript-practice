import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId, Entry } from '../types';

const getAllPatients = (): Patient[] => {
  return patients;
};

const getPatientById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const getAllNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addNewPatient = (patientObject: NewPatient): NonSensitivePatient => {
  const newPatient = {
    ...patientObject,
    id: uuid(),
    entries: []
  };

  patients.push(newPatient);
  const newPatientToReturn = newPatient as Partial<NewPatient>;
  delete newPatientToReturn.ssn;
  delete newPatientToReturn.entries;
  return newPatientToReturn as NonSensitivePatient;
};

const addNewEntry = (id: string, entryObject: EntryWithoutId): Entry => {
  const newEntry = {
    ...entryObject,
    id: uuid()
  };

  const patient = patients.find(p => p.id === id);
  patient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllPatients,
  getAllNonSensitivePatients,
  addNewPatient,
  getPatientById,
  addNewEntry
};