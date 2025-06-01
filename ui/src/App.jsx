import './App.css'
import Navbar from './components/Navbar'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThreadCard from './components/ThreadCard';
import HomePage from './views/HomePage';

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
      <main className='bg-neutral-800 text-white min-h-screen'>
        <div>
          <HomePage></HomePage>
        </div>

      </main>
    </ThemeProvider>
  );
}


