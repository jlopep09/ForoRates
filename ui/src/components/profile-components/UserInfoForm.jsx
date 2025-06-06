import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ENDPOINTS } from '../../../constants';

export default function UserInfoForm({ userData }) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullname: userData?.fullname || '',
    img_link: userData?.img_link || ''
  });
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);

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
      const response = await fetch(`${ENDPOINTS.USERS}/${userData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      // Almacenar mensaje de éxito en localStorage antes de recargar
      localStorage.setItem('infoUpdateSuccess', 'true');
      handleClose();
      window.location.reload();

    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage("ERROR: The user information could not be updated. Please try again later.");
    }
  };

  // Verificar si hay un mensaje de éxito al cargar la página
  React.useEffect(() => {
    if (localStorage.getItem('infoUpdateSuccess')) {
      setSuccessMessage('User information updated successfully!');
      // Limpiar el valor de localStorage para que no se muestre después de la recarga
      localStorage.removeItem('infoUpdateSuccess');
    }
  }, []);

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Editar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modifica tus datos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor complete los siguientes campos de datos en el formato correcto para que puedan actualizarse.
          </DialogContentText>
          <TextField
            margin="dense"
            name="fullname"
            label="Nombre completo"
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
            label="URL de imagen de perfil"
            type="url"
            fullWidth
            variant="standard"
            value={formData.img_link}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {errorMessage && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      {successMessage && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
          <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </React.Fragment>
  );
}
