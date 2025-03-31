import './App.css'
import Navbar from './components/Navbar'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThreadCard from './components/ThreadCard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar/>
      <main className='bg-stone-800'>
        <div className='flex row'>
          <ThreadCard></ThreadCard>
          <ThreadCard></ThreadCard>
          <ThreadCard></ThreadCard>
          <ThreadCard></ThreadCard>
        </div>

      </main>
    </ThemeProvider>
  );
}


