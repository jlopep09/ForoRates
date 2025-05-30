import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import { ProfilePhoto } from '../../components/profile-components/ProfilePhoto.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileMainInfo from '../../components/profile-components/ProfileMainInfo.jsx';
import { ProfileLinkSection } from '../../components/profile-components/ProfileLinkSection.jsx';
import { Button } from '@mui/material';
import { ENDPOINTS } from '../../../constants.js';
import LoginButton from '../../components/SessionButtons/LoginButton.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import Thread from '../Thread.jsx';
import { UserBalance } from './shop-components/UserBalance.jsx';
import { ShopCatalog } from './shop-components/ShopCatalog.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Shop = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className='bg-neutral-800'>
        <div className='flex flex-row justify-center gap-10'>
          <div className='flex flex-col items-center justify-center'>
            <ProfilePhoto userData={userData} PhotoWidth={150} PhotoHeight={150} />
          </div>
          <div className='flex flex-col items-center justify-center'><UserBalance UserData={userData} /></div>
          
        </div>
        <ShopCatalog />
      </main>
    </ThemeProvider>
  );
};
