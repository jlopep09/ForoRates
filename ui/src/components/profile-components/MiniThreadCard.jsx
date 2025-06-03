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
          "https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg"
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
      <CloseThreadButton thread={thread} onClose={onClose} />
      <DeleteThreadButton thread={thread} onDelete={onDelete} />
    </Card>
  );
};

export default MiniThreadCard;
