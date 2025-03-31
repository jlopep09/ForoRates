import React from 'react'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import { ProfilePhoto } from '../components/profile-components/ProfilePhoto'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileMainInfo from '../components/profile-components/ProfileMainInfo';
import { ProfileLinkSection } from '../components/profile-components/ProfileLinkSection';

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
        <ProfilePhoto UserID = {3} PhotoWidth={180} PhotoHeight={180}/>
        <ProfileMainInfo UserID = {3}></ProfileMainInfo>
        <ProfileLinkSection UserID={3}></ProfileLinkSection>
      </div>
      </main>
    </ThemeProvider>
    </>
  )
}

