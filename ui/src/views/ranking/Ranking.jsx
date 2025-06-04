import React, { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RankingTable } from './components/RankingTable';
import Navbar from '../../components/Navbar';
import { ENDPOINTS } from '../../../constants';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const Ranking = () => {
    //listado de usuarios ordenado por score
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
          try {
            const response = await fetch(`${ENDPOINTS.RANKING}`);
            if (!response.ok) {
              throw new Error("Error fetching ranking data");
            }
            const data = await response.json();
            setUserData(data);
          } catch (error) {
            console.error("Error fetching ranking data:", error);
          }
        }
    
        fetchUserData();
      }, []);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className='bg-neutral-800'>
        <div className='flex flex-col align-middle justify-start py-10 items-center min-h-100'>
            <h1 className='uppercase font-bold text-2xl'>mejores usuarios</h1>
            <hr className='mx-6 w-100 mb-2'/>
            {
                userData &&(
                    <RankingTable usersData={userData}/>
                )
            }
            {
                !userData &&(
                    <p className='font-bold text-blue-300'>Generando ranking... Si el proceso tarda vuelva en unos minutos.</p>
                )
            }
        </div>
      </main>
    </ThemeProvider>
  );
};


