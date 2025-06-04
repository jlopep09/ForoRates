import React from 'react';
import { useNavigate } from 'react-router';

import Navbar from '../components/Navbar';

import {
  Container,
  Typography,
  Button,
  CssBaseline
} from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';

// Tema oscuro
const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

export const ThreadCreationError = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className="bg-neutral-800 min-h-screen flex items-center justify-center">
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            No se pudo crear el hilo
          </Typography>
          <Typography variant="body1" paragraph>
            No puedes crear hilos porque tu cuenta está bloqueada.
            Si crees que se trata de un error, por favor, contacta con un administrador para obtener ayuda.
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Volver
          </Button>
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default ThreadCreationError;
