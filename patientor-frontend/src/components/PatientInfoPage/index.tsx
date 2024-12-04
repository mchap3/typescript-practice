import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Patient, Diagnosis, EntryWithoutId } from "../../types";
import { useEffect, useState } from "react";
import { Male, Female } from '@mui/icons-material';
import { EntryDetails } from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { Button } from "@mui/material";
import axios from 'axios';

const PatientInfoPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams() as { id: string };
  
  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatient(patient);
    };
    fetchPatient();
  }, [id]);
  
  if (patient) {
    const submitNewEntry = async (newEntry: EntryWithoutId) => {
      try {
        const addedEntry = await patientService.addEntry(id, newEntry);
        setPatient({
          ...patient,
          entries: patient.entries.concat(addedEntry)
        });
        setModalOpen(false);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    };
  
    return (
      <div>
        <div>
          <h2>{patient.name} {getGenderIcon(patient.gender)}</h2>
          <br />
          Date of Birth: {patient.dateOfBirth}
          <br />
          SSN: {patient.ssn}
          <br />
          Occupation: {patient.occupation}
        </div>
        <div>
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            onClose={closeModal}
            error={error}
            diagnoses={diagnoses}
          />
        </div>
        <div>
          <h3>Entries</h3>
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
          {patient.entries.map((entry, index) => 
            <EntryDetails key={index} entry={entry} diagnoses={diagnoses} />
          )}
        </div>
      </div>
    );
  }
};

const getGenderIcon = (gender: string) => {
  switch (gender) {
    case 'male':
      return <Male />;
    case 'female':
      return <Female />;
    default:
      return null;
  }
};

export default PatientInfoPage;