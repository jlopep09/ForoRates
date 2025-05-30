import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ProfilePhoto } from '../components/profile-components/ProfilePhoto';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileMainInfo from '../components/profile-components/ProfileMainInfo';
import { ProfileLinkSection } from '../components/profile-components/ProfileLinkSection';
import { Button } from '@mui/material';
import { ENDPOINTS } from '../../constants';
import LoginButton from '../components/SessionButtons/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import Thread from '../views/Thread.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Profile = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  const handleBackFromThread = () => setSelectedThreadId(null);

  useEffect(() => {
    async function fetchUserData(email) {
      try {
        const response = await fetch(`${ENDPOINTS.USERS}?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error("Error fetching user data");
        }
        const data = await response.json();
        setUserData(data[0]);  // El backend devuelve una lista
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && isAuthenticated && user?.email) {
      fetchUserData(user.email);
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  if (loading || authLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <main className='bg-neutral-800'>
          <div className='flex flex-col'>
            <p className="py-8">Cargando...</p>
          </div>
        </main>
      </ThemeProvider>
    );
  }

  if (!userData) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <main className='bg-neutral-800'>
          <div className='flex flex-col'>
            <p className="py-8">Ups... Parece que no estás registrado.</p>
            <div className="flex justify-center items-center h-full w-full my-3 gap-x-2">
              <Button variant="outlined"><LoginButton /></Button>
            </div>
          </div>
        </main>
      </ThemeProvider>
    );
  }
  if (selectedThreadId) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <main className='bg-neutral-800'>
          <Thread id={selectedThreadId} onBack={handleBackFromThread} />
          
        </main>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className='bg-neutral-800'>
        <div className='flex flex-col'>
          <ProfilePhoto userData={userData} PhotoWidth={180} PhotoHeight={180} />
          <ProfileMainInfo userData={userData} />
          <ProfileLinkSection UserID={userData.id} onThreadSelect={setSelectedThreadId} />
        </div>
      </main>
    </ThemeProvider>
  );
};
