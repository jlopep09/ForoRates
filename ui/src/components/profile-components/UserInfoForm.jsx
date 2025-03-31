import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function UserInfoForm({userData}) {
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
        Edit information
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
        <DialogTitle>Edit your user information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please complete the following data fields in the correct format so they can be updated.
          </DialogContentText>
          <TextField margin="dense" name="fullname" label="Full Name" type="text" fullWidth variant="standard" required value={userData[0].fullname}/>
          <TextField margin="dense" name="img_link" label="Profile Image URL" type="url" fullWidth variant="standard" value={userData[0].img_link}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
