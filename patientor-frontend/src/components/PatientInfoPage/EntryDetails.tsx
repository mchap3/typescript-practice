import { Entry, Diagnosis, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import { DiagnosesList } from "./DiagnosesList";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

const entryStyle = {
  borderStyle: 'solid',
  borderWidth: 2,
  padding: 5,
  marginTop: 10,
  borderRadius: '5px'
};

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const getEntryIcon = (entry: Entry) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <MedicalServicesIcon />;
      case 'Hospital':
      return <LocalHospitalIcon />;
    case 'OccupationalHealthcare':
      return <WorkIcon />;
    default: assertNever(entry);
  }
};

export const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    default: assertNever(entry);
  }
};

const HospitalEntryDetails = ({ entry, diagnoses }: { entry: HospitalEntry, diagnoses: Diagnosis[]}) => {
  return (
    <div style={entryStyle}>
      <BaseEntry entry={entry} diagnoses={diagnoses} />
      <br />
      Discharged on {entry.discharge.date}: <em>{entry.discharge.criteria}</em>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry, diagnoses: Diagnosis[]}) => {
  return (
    <div style={entryStyle}>
      <BaseEntry entry={entry} diagnoses={diagnoses} />
      <br />
      {entry.sickLeave
        ? `On leave from ${entry.employerName}: ${entry.sickLeave.startDate} – ${entry.sickLeave.endDate}`
        : null
      }
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry, diagnoses }: { entry: HealthCheckEntry, diagnoses: Diagnosis[]}) => {
  const ratingColor = ['green', 'yellow', 'orange', 'red'];
  return (
    <div style={entryStyle}>
      <BaseEntry entry={entry} diagnoses={diagnoses} />
      <FavoriteIcon sx={{color : ratingColor[entry.healthCheckRating]}}/>
    </div>
  );
};

const BaseEntry = ({ entry, diagnoses }: EntryDetailsProps) => {
  return (
    <div>
      <strong>{entry.date}</strong> {getEntryIcon(entry)}
      <br />
      <em>{entry.description}</em>
      {entry.diagnosisCodes
        ? <DiagnosesList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
        : null
      }
      <br />
      Diagnosed by {entry.specialist}
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};