import express, { NextFunction, Request, Response } from 'express';
import patientService from '../services/patientService';
import { Entry, EntryWithoutId, NewPatient, NonSensitivePatient, Patient } from '../types';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getAllNonSensitivePatients());
});

router.get('/:id', (req, res: Response<Patient>) => {
  const patient = patientService.getPatientById(req.params.id);
  res.send(patient);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<NonSensitivePatient>
  ) => {
    const addedPatient = patientService.addNewPatient(req.body);
    res.json(addedPatient);
});

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post('/:id/entries', newEntryParser,
  (req: Request<{id: string}, unknown, EntryWithoutId>, res: Response<Entry>) => {
    const addedEntry = patientService.addNewEntry(req.params.id, req.body);
    res.json(addedEntry);
  }
);

router.use(errorMiddleware);

export default router;