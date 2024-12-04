import { useState, SyntheticEvent } from "react";

import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent, Input, FormControl } from '@mui/material';

import { EntryWithoutId, EntryType, HealthCheckRating, UnionOmit, BaseEntry, Diagnosis } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.Hospital);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const type = Object.values(EntryType).find(t => t === value);
      if (type) {
        setEntryType(type);
      }
    }
  };
  
  const onRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating).find(t => t === value);
      if (rating !== undefined) {
        setHealthCheckRating(HealthCheckRating[rating as keyof typeof HealthCheckRating]);
      }
    }
  };

  const onDiagnosisCodeChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    event.preventDefault();
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    let newEntryBase: UnionOmit<BaseEntry, 'id'> = {
      date: date,
      description: description,
      specialist: specialist,
    };
    if (diagnosisCodes) {
      newEntryBase = {
        ...newEntryBase,
        diagnosisCodes: diagnosisCodes
      };
    }
    
    let newEntry: EntryWithoutId;
    switch (entryType) {
      case EntryType.Hospital:
        newEntry = {
          ...newEntryBase,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;
      case EntryType.HealthCheck:
        newEntry = {
          ...newEntryBase,
          type: 'HealthCheck',
          healthCheckRating: healthCheckRating
        };
        break;
      case EntryType.OccupationalHealthcare:
        newEntry = {
          ...newEntryBase,
          type: 'OccupationalHealthcare',
          employerName: employerName,
          sickLeave: {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd
          }
        };
        break;
    }

    onSubmit(newEntry);
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <FormControl sx={{ mb: 1 }} fullWidth>
          <InputLabel>Entry Type</InputLabel>
          <Select
            label="Entry Type"
            value={entryType}
            onChange={onTypeChange}
          >
          {Object.values(EntryType).map(option =>
            <MenuItem
              key={option}
              value={option}
            >
              {option}
            </MenuItem>
          )}
          </Select>
        </FormControl>
        <InputLabel>Date</InputLabel>
        <Input
          sx={{ mb: 1 }}
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          sx={{ mb: 1 }}
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <FormControl sx={{ mb: 1 }} fullWidth>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={onDiagnosisCodeChange}
            renderValue={(selected) => {
              return selected.join(', ');
            }}
          >
            {diagnoses.map(({ code }) => (
              <MenuItem
                key={code}
                value={code}
              >
                {code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          sx={{ mb: 1 }}
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        {entryType === EntryType.Hospital
          ? <div>
            <InputLabel>Discharge Date</InputLabel>
            <Input
              sx={{ mb: 1 }}
              type="date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              sx={{ mb: 1 }}
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </div>
          : null
        }

        {entryType === EntryType.HealthCheck
          ? <div>
            <FormControl sx={{ mb: 1 }} fullWidth>
              <InputLabel>Health Rating</InputLabel>
              <Select
                value={HealthCheckRating[healthCheckRating]}
                onChange={onRatingChange}
              >
              {Object.values(HealthCheckRating).filter(val => isNaN(Number(val)))
                .map(option =>
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    {option.toString()}
                  </MenuItem>
              )}
              </Select>
            </FormControl>
          </div>
          : null
        }

        {entryType === EntryType.OccupationalHealthcare
          ? <div>
            <InputLabel>Workplace Information</InputLabel>
            <TextField
              sx={{ mb: 1 }}
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <InputLabel>Sick Leave</InputLabel>
            <InputLabel>Start Date</InputLabel>
            <Input
              sx={{ mb: 1 }}
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <InputLabel>End Date</InputLabel>
            <Input
              sx={{ mb: 1 }}
              type='date'
              fullWidth
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </div>
          : null
        }

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;