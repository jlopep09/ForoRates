import React from 'react'
import Navbar from '../components/Navbar'
import { ProfilePhoto } from '../components/profile-components/ProfilePhoto'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProfileMainInfo from '../components/profile-components/ProfileMainInfo';
import { ProfileLinkSection } from '../components/profile-components/ProfileLinkSection';
import { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { ENDPOINTS } from '../../constants';
import { NavLink } from 'react-router';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const Profile = ({ UserID }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${ENDPOINTS.USERS}/${UserID}`);
        if (!response.ok) {
          throw new Error("Error fetching user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (UserID) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [UserID]);

  if (loading) {
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
              <Button variant="outlined"><NavLink to="/signin">Sign in</NavLink></Button>
              <Button variant="outlined"><NavLink to="/signup">Sign up</NavLink></Button>
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
        <div className='flex flex-col'>
          <ProfilePhoto userData={userData} PhotoWidth={180} PhotoHeight={180} />
          <ProfileMainInfo userData={userData} />
          <ProfileLinkSection UserID={UserID} />
        </div>
      </main>
    </ThemeProvider>
  );
};


