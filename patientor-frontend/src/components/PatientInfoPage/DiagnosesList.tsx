import { Diagnosis } from "../../types";

interface DiagnosesListProps {
  diagnosisCodes: Array<Diagnosis['code']>;
  diagnoses: Diagnosis[];
}
export const DiagnosesList = ({ diagnosisCodes, diagnoses }: DiagnosesListProps) => {
  return (
    <ul>
      {diagnosisCodes?.map((code, index) => {
        const diagnosis = diagnoses.find(v => v.code === code);
        if (diagnosis)
          return (
            <li key={index}>{diagnosis.code} {diagnosis.name}</li>
          );
      })}
    </ul>
  );
};
