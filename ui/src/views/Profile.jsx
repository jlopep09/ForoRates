import React from 'react'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import { ProfilePhoto } from '../components/profile-components/ProfilePhoto'
import Button from '@mui/material/Button'
import { Card } from '@mui/material';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const Profile = () => {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ResponsiveAppBar/>
      <main className='bg-neutral-800'>
      <div className='flex flex-col'>
        <ProfilePhoto></ProfilePhoto>
        <ProfileMainInfo></ProfileMainInfo>
        <MyThreadsSection></MyThreadsSection>
      </div>
      </main>
    </ThemeProvider>
    </>
  )
}

function ProfileMainInfo() {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full my-3'>
      <p>Jose Lopez Perez</p>
      <p>@jlopep09</p>
      <p>Score: </p>
      <div className='flex justify-center items-center h-full w-full my-3 gap-x-2'>
        <Button variant="outlined">Editar</Button>
        <Button variant="outlined">Historial</Button>
      </div>
    </div>
  )
}
function MyThreadsSection() {
  return (
    <div className='flex flex-row gap-3 justify-center items-center'>
        <MiniThreadCard></MiniThreadCard>
        <MiniThreadCard></MiniThreadCard>
        <MiniThreadCard></MiniThreadCard>
        <MiniThreadCard></MiniThreadCard>
    </div>
  );
}
function MiniThreadCard() {
  return (
    <Card sx={{ maxWidth: 215 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="70"
        image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles...
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

