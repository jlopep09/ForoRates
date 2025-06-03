import { Button, CardActions } from '@mui/material';
import React from 'react'


function DeleteThreadButton({ thread, onDelete }) {
  return (
    <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
      <Button
        variant="contained"
        color="error"
        size="small"
        disabled={!thread?.id}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Eliminar hilo
      </Button>
    </CardActions>
  );
}

export default DeleteThreadButton;
