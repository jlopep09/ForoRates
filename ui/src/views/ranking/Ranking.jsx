import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RankingTable } from './components/RankingTable';
import Navbar from '../../components/Navbar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const Ranking = () => {
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className='bg-neutral-800'>
        <div className='flex flex-col align-middle justify-start py-10 items-center min-h-100'>
            <h1 className='uppercase font-bold text-2xl'>Best users</h1>
            <hr className='mx-6 w-100 mb-2'/>
            <RankingTable>

            </RankingTable>
        </div>
      </main>
    </ThemeProvider>
  );
};


