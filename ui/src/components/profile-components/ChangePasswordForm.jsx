import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ChangePasswordForm({userData}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Change password
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              console.log(formJson);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Password recovery</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please complete the following data fields in the correct format so they can be updated.
          </DialogContentText>
          <TextField margin="dense" name="email" label="Email Address" type="email" fullWidth variant="standard" required />
          <TextField margin="dense" name="old_password" label="Your password" type="password" fullWidth variant="standard" required />
          <TextField margin="dense" name="new_password" label="New password" type="password" fullWidth variant="standard" required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
