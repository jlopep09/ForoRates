import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

import {
  TextField,
  Button,
  Container,
  Typography,
  CssBaseline,
  Stack
} from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ENDPOINTS } from '../../constants';


//Crear el tema oscuro
const darkTheme = createTheme({
    palette: {mode: 'dark'},
});

export const NewThread = () => {

    const [title, setTitle] = useState('');
        //useState devuelve un par [valor, funcion para actualizar el valor]
    const [content, setContent] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [tags, setTags] = useState('');
    const [isClosed, setIsClosed] = useState(false); //Siempre falso al crear
    const [votes] = useState(0); //Siempre 0 al crear
    const [submitting, setSubmitting] = useState(false);
      
    const navigate = useNavigate();

    //Handler function for submiting the form
    const handleSubmit = async (e) => {
        e.preventDefault(); //Para no recargar la págimna con el submit
        //console.log('Se envía hilo con título: ', title);
        setSubmitting(true); //Esto es para que si le damos 2 veces al boton de publicar solo se publique una vez,
                             //se utiliza en el formulario, en la parte del submit button.

        //Fecha actual en formato ISO
        const now = new Date();
        const dateISO = now.toISOString();

        //Crear una array de tags a partir de la cadena CSV
        const tagsArray = tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        //Payload que espera el backend
        const payload = {
            title: title,
            content: content,
            is_closed: false,//falso a la hora de crearlo
            img_link: imgLink || null,
            user_id: UserID,//Hay que pasarselo al nuevo componente como id del autor
            date: dateISO,
            tags: tagsArray,//La lista de strings creada justo antes
            votes: votes// cero a la hora de crear
        };

      try {
        const res = await fetch(ENDPOINTS.NEW_THREAD, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!res.ok) {
          //Si el back devuelve un error 400/500, leemos el JSON con detalle
          const errorData = await res.json();
          throw new Error(errorData.detail || 'Error creando el hilo');
        }
  
        const newThread = await res.json();
        console.log('Hilo creado: ', newThread);
  
        //Redirigir a la vista del hilo recién creado
        navigate(`/threads/${newThread.id}`);
      } catch (err) {
        console.error(err);
        alert(`No se pudo crear el hilo: ${err.message}`);
        setSubmitting(false);
      }

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

                    <Stack spacing={2}>

                        {/* Input título */}
                        <TextField
                            label="Título del hilo"
                            variant="outlined"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {/* Input contenido */}
                        <TextField
                            label="Contenido"
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/*Input URL foto */}
                        <TextField
                            label="URL de portada (opcional)"
                            variant="outlined"
                            fullWidth
                            value={imgLink}
                            onChange={(e) => setImgLink(e.target.value)}
                        />

                        {/* Input tags separados por comas */}
                        <TextField
                            label="Tags (separados por comas) (opcional)"
                            variant="outlined"
                            fullWidth
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        {/* Boton submit */}
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ mt: 2}}>
                            {submitting ? 'Publicando...' : 'Publicar hilo'}
                        </Button>
                    </Stack>
                </form>
            </Container>
        </ThemeProvider>
    );
};



