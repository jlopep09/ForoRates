import { Button, CardActions } from '@mui/material';
import React from 'react'

function CloseThreadButton({thread, onClose}) {
  return (
    <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        {thread.is_closed ? (
          <Button variant="outlined" color="secondary" size="small" disabled>
            Cerrado
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cerrar hilo
          </Button>
        )}
      </CardActions>
  )
}

export default CloseThreadButton