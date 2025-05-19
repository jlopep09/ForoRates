import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Button, Container, TextField, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/Navbar';
import { useState } from 'react'; //para manejar el estado local en componentes


//Crear el tema oscuro
const darkTheme = createTheme({
    palette: {mode: 'dark'},
});

export const NewThread = () => {

    const [title, setTitle] = useState('');
        //useState devuelve un par [valor, funcion para actualizar el valor]

    //Handler function for submiting the form
    const handleSubmit = (e) => {
        e.preventDefault(); //Para no recargar la págimna con el submit
        console.log('Se envía hilo con título: ', title);
        //POR AHORA NO SE HACE EL POST
    };

    return (
        <ThemeProvider theme={darkTheme}>
            {/* Para los estilos basicos */}
            <CssBaseline /> 

            <Navbar />

            <Container maxWidth="sm" sx={{ mt: 4 }}> {/*mt es margin-top */}
                <Typography variant="h4" gutterBottom>
                    Crear nuevo hilo
                    {/* Meter dentro de typography para tipografia consistente
                    gutterBottom para margen inferior*/}
                </Typography>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/*Input título */}
                    <TextField
                        fullWidth
                        label="Título del hilo"
                        value={title}
                        onChange={e => setTitle(e.target.value)}  
                        margin="normal"
                        required
                    />

                    <Button type="submit" variant="contained" sx={{ mt: 3}}>
                        Publicar
                    </Button>
                </form>
            </Container>
        </ThemeProvider>
    );
};



