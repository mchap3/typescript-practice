import { Gender, HealthCheckRating } from "./types";
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

export const NewEntryBase = {
  date: z.string().date(),
  description: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.string().array().optional()
};

const NewHealthCheckEntry = z.object({
  type: z.literal('HealthCheck'),
  ...NewEntryBase,
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const NewHospitalEntry = z.object({
  type: z.literal('Hospital'),
  ...NewEntryBase,
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string()
  })
});

const NewOccupationalHealthcareEntry = z.object({
  type: z.literal('OccupationalHealthcare'),
  ...NewEntryBase,
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string().date(),
    endDate: z.string().date()
  }).optional()
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry
]);