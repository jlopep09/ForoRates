// AddCommentInThread.jsx

import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { ENDPOINTS } from '../../../constants';
import { useAuth0 } from '@auth0/auth0-react';

const AddCommentInThread = ({ dbUser, threadId, isClosed, onCommentAdded }) => {
  const { loginWithRedirect } = useAuth0();

  // Si el hilo está cerrado, no permitimos añadir comentarios
  if (isClosed) {
    return (
      <Typography
        sx={{
          color: 'gray',
          fontStyle: 'italic',
          mt: 2,
          textAlign: 'center'
        }}
      >
        Este hilo está cerrado y no se pueden añadir comentarios.
      </Typography>
    );
  }

  // Si no hay usuario autenticado, mostramos botón para iniciar sesión
  if (!dbUser) {
    return (
      <Button variant="outlined" onClick={() => loginWithRedirect()}>
        Iniciar sesión para comentar
      </Button>
    );
  }

  const userId = dbUser.id;
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState('');

  const handleCancel = () => {
    setComment('');
    setIsFocused(false);
  };

  const handleAccept = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.COMMENTS}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          user_id: userId,
          thread_id: threadId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al enviar comentario");

      // Comentario insertado correctamente
      console.log("Comentario insertado con ID:", data.comment_id);
      setComment('');
      setIsFocused(false);

      // Avisamos al padre (Thread) de que hay un nuevo comentario
      if (typeof onCommentAdded === 'function') {
        onCommentAdded();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='border border-gray-400 p-2 rounded-md mt-4'>
      <TextField
        id="standard-basic"
        label="Escribe un comentario..."
        variant="standard"
        fullWidth
        multiline
        value={comment}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => setComment(e.target.value)}
      />
      {isFocused && (
        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={handleCancel} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            variant="contained"
            disabled={comment.trim() === ''}
          >
            Aceptar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddCommentInThread;
