import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ENDPOINTS } from '../../../constants';

export const ProfileLinkSection = ({ UserID, onThreadSelect }) => {
  const [threads, setThreads] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await fetch(`${ENDPOINTS.THREADS}/user/${UserID}`);
        if (!response.ok) {
          throw new Error("Error fetching threads");
        }
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    }

    if (UserID) {
      fetchThreads();
    }
  }, [UserID]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 4, threads.length - 4));
  };

  //Manejador para el botón de cerrar hilo
  const handleCloseThread = async (threadId, index) => {
    //Comprobar si ya está cerrado.
    if(threads[index].is_closed) {
      alert('Este hilo ya está cerrado.');
      return;
    }

    try{
      const res = await fetch(`${ENDPOINTS.THREADS}/${threadId}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if(!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Error cerrando el hilo');
      }

      const updatedThread = await res.json();
      setThreads(prev => {
        const copy = [...prev];
        copy[index] = updatedThread;
        return copy;
      });
    } catch(err) {
      console.error(err);
      alert(`No se pudo cerrar el hilo: ${err.message}`);
    }
  };

  //idx es la posición dentro del subarray de 4 hilos
  return (
    <div className='flex flex-row gap-3 justify-center items-center'>
      <Button onClick={handlePrev} disabled={currentIndex === 0}>Prev</Button>
      {threads.slice(currentIndex, currentIndex + 4).map((thread, idx) => (
        <MiniThreadCard
          key={thread.id}
          thread={thread}
          onClick={() => onThreadSelect(thread.id)}
          onClose={() => handleCloseThread(thread.id, currentIndex + idx)}
        />
      ))}
      <Button onClick={handleNext} disabled={currentIndex + 4 >= threads.length}>Next</Button>
    </div>
  );
};

//El onClick se mueve de la Card al Cardcontent para que el botón de cerrar no abra la vista del hilo
const MiniThreadCard = ({ thread, onClick }) => {
  return (
    <Card className="cursor-pointer max-w-xs hover:shadow-lg transition"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}
    >
      {thread.img_link && (
        <CardMedia
          component="img"
          height="140"
          image={thread.img_link}
          alt="thread thumbnail"
        />
      )}
      <CardContent onClick={onClick}>
        <Typography gutterBottom variant="h6" component="div">
          {thread.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {thread.content.slice(0, 50)}...
        </Typography>
      </CardContent>

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
    </Card>
  );
};