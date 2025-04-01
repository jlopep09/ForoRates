import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function UserInfoForm({ userData }) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullname: userData[0]?.fullname || '',
    img_link: userData[0]?.img_link || ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${userData[0]?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      console.log('User updated successfully');
      handleClose();
      window.location.reload();  // 👈 Recarga la página completamente
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit information
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit your user information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please complete the following data fields in the correct format so they can be updated.
          </DialogContentText>
          <TextField
            margin="dense"
            name="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            required
            value={formData.fullname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="img_link"
            label="Profile Image URL"
            type="url"
            fullWidth
            variant="standard"
            value={formData.img_link}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
