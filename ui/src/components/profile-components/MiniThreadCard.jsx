import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CloseThreadButton from '../thread-components/CloseThreadButton';
import DeleteThreadButton from '../thread-components/DeleteThreadButton';

const MiniThreadCard = ({ thread, onClick, onClose, onDelete }) => {
  return (
    <Card
      className="cursor-pointer max-w-xs hover:shadow-lg transition"
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      onClick={onClick}  // abre el detalle del hilo
    >
      <CardMedia
        component="img"
        height="140"
        image={
          thread.img_link ||
          "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="thread thumbnail"
      />
      <CardContent className='h-30'>
        <Typography gutterBottom variant="h6" component="div">
          {thread.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {thread.content.slice(0, 50)}...
        </Typography>
      </CardContent>
      {/* El botón de cerrar hilo, llama a onClose() y el de eliminar hilo llama a onDelete() */}
      <div className='flex justify-center gap-0 items-center'>
        <CloseThreadButton thread={thread} onClose={onClose} />
        <DeleteThreadButton thread={thread} onDelete={onDelete} />
      </div>
      
    </Card>
  );
};

export default MiniThreadCard;
