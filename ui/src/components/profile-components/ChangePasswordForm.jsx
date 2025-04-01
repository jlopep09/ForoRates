import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ChangePasswordForm({ userData }) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: userData[0]?.email || '',
    old_password: '',  // Campo para la contraseña actual
    new_password: '',  // Campo para la nueva contraseña
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
      const response = await fetch(`http://localhost:3000/users/${userData[0]?.id}/change_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: formData.old_password,  // Contraseña actual
          new_password: formData.new_password,  // Nueva contraseña
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      console.log('Password updated successfully');
      handleClose();
      //window.location.reload();  // Recarga la página
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Change password
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please complete the following fields to update your password.
          </DialogContentText>
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            required
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          <TextField
            margin="dense"
            name="old_password"
            label="Current Password"
            type="password"
            fullWidth
            variant="standard"
            required
            value={formData.old_password}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="new_password"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            required
            value={formData.new_password}
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
