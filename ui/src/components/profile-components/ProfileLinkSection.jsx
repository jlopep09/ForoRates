import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export const ProfileLinkSection = ({ UserID }) => {
  const [threads, setThreads] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await fetch(`http://localhost:3000/users/${UserID}/threads`);
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

  return (
    <div className='flex flex-row gap-3 justify-center items-center'>
      <Button onClick={handlePrev} disabled={currentIndex === 0}>Prev</Button>
      {threads.slice(currentIndex, currentIndex + 4).map(thread => (
        <MiniThreadCard key={thread.id} thread={thread} />
      ))}
      <Button onClick={handleNext} disabled={currentIndex + 4 >= threads.length}>Next</Button>
    </div>
  );
};

function MiniThreadCard({ thread }) {
  return (
    <Card sx={{ maxWidth: 215 }}>
      <CardMedia
        component="img"
        alt={thread.title}
        height="70"
        image={thread.image || "https://mui.com/static/images/cards/contemplative-reptile.jpg"}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {thread.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {thread.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}