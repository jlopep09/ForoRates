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
import Thread from '../views/Thread.jsx';
import { useAuth0 } from '@auth0/auth0-react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Profile = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Estado de todos los threads del usuario
  const [threads, setThreads] = useState([]);
  // 2) Índice para paginar (igual que antes)
  const [currentIndex, setCurrentIndex] = useState(0);
  // 3) Hilo seleccionado (su ID y su índice real en el array)
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedThreadIndex, setSelectedThreadIndex] = useState(null);

  const handleBackFromThread = () => {
    setSelectedThreadId(null);
    setSelectedThreadIndex(null);
  };

  // Función para “cerrar” un hilo: llama al endpoint y actualiza el array en padre
  const handleCloseThread = async (threadId, index) => {
    if (typeof index !== 'number' || index < 0 || index >= threads.length) {
      console.warn('Índice inválido para cerrar el hilo:', index);
      return;
    }

    if (threads[index]?.is_closed) {
      alert('Este hilo ya está cerrado.');
      return;
    }

    try {
      const res = await fetch(`${ENDPOINTS.THREADS}/${threadId}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Error cerrando el hilo');
      }
      const updatedThread = await res.json();
      setThreads(prev => {
        const copia = [...prev];
        copia[index] = updatedThread;
        return copia;
      });
    } catch (err) {
      console.error(err);
      alert(`No se pudo cerrar el hilo: ${err.message}`);
    }
  };


  //Handler para eliminar un hilo: llama al endpoint DELETE y actualiza el array
  const handleDeleteThread = async (threadId, index) => {
    if(typeof index !== 'number' || index < 0 || index >= threads.length) {
      console.warn('Índice inválido para eliminar el hilo:', index);
      return;
    }

    //Confirmación
    const confirmar = window.confirm('¿Seguro que deseas eliminar este hilo?');
    if(!confirmar) return;

    try {
      const res = await fetch(`${ENDPOINTS.THREADS}/${threadId}`, {
        method: 'DELETE',
      });

      if(res.status === 204) {
        //Borrado exitoso: removemos del array
        setThreads(prev => prev.filter((_, i) => i !== index));
      } else {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Error al eliminar el hilo');
      }
    } catch (err) {
      console.error(err);
      alert(`No se pudo eliminar el hilo: ${err.message}`);
    }
  };

  // Handler para seleccionar un hilo (nos llega desde el hijo los dos valores)
  const handleSelectThread = (threadId, indexReal) => {
    setSelectedThreadId(threadId);
    setSelectedThreadIndex(indexReal);
  };

  // Lógica de fetch para userData
  useEffect(() => {
    async function fetchUserData(email) {
      try {
        const response = await fetch(`${ENDPOINTS.USERS}?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error("Error fetching user data");
        const data = await response.json();
        setUserData(data[0]);
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

  // Fetch threads una vez que tenemos userData.id
  useEffect(() => {
    if (userData?.id) {
      (async () => {
        try {
          const response = await fetch(`${ENDPOINTS.THREADS}/user/${userData.id}`);
          if (!response.ok) throw new Error("Error fetching threads");
          const data = await response.json();
          setThreads(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [userData]);

  // Render mientras carga userData / auth
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

  // Si no hay userData registrado
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

  // Si ya elegimos un hilo, mostramos la vista detalle con <Thread />
  if (selectedThreadId !== null && selectedThreadIndex !== null) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <main className='bg-neutral-800'>
          <Thread
            id={selectedThreadId}
            index={selectedThreadIndex}
            onBack={handleBackFromThread}
            dbUser={userData}
            handleCloseThread={handleCloseThread}
            handleDeleteThread={handleDeleteThread}
            user_thread_id={userData.id}
          />
        </main>
      </ThemeProvider>
    );
  }

  // Vista normal de perfil con el carrusel de hilos
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main className='bg-neutral-800'>
        <div className='flex flex-col'>
          <ProfilePhoto userData={userData} PhotoWidth={180} PhotoHeight={180} />
          <ProfileMainInfo userData={userData} />
          <ProfileLinkSection
            threads={threads}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onThreadSelect={handleSelectThread}   // <— enviamos la función que recibe (threadId, indexReal)
            onCloseThread={handleCloseThread}
            onDeleteThread={handleDeleteThread}
          />
        </div>
      </main>
    </ThemeProvider>
  );
};
