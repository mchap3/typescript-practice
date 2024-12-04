import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';
import { Diagnosis, EntryWithoutId } from "../../types";
import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
  diagnoses: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnoses }: Props) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new entry for patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onCancel={onClose} onSubmit={onSubmit} diagnoses={diagnoses} />
    </DialogContent>
  </Dialog>
  );
};

export default AddEntryModal;