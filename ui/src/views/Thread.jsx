import { useEffect, useState, useCallback } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ENDPOINTS } from "../../constants";
import { CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router";
import AddCommentInThread from "../components/thread-components/AddCommentInThread";
import CommentList from "../components/thread-components/CommentList";
import CloseThreadButton from "../components/thread-components/CloseThreadButton";
import DeleteThreadButton from "../components/thread-components/DeleteThreadButton";
import BanUserButton from "../components/thread-components/BanUserButton";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const fetchIsBannedStatus = async (userId) => {
  try {
    const response = await fetch(`${ENDPOINTS.USERS}/is_banned/${userId}`);
    if (!response.ok) throw new Error("Error al obtener estado de baneo");
    const isBanned = await response.json(); // true o false
    return isBanned;
  } catch (err) {
    console.error("Error obteniendo estado de baneo:", err);
    return false; // fallback por defecto
  }
};


const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / (3600 * 24));
  const months = Math.floor(diff / (3600 * 24 * 30));
  const years = Math.floor(diff / (3600 * 24 * 365));

  if (diff < 60) return `hace unos segundos`;
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days < 30) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
};

export default function Thread({ id, index, onBack, dbUser, handleCloseThread, handleDeleteThread, user_thread_id }) {
  const thread_id = id;
  const [thread, setThread] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const navigate = useNavigate();
  const [comentariosRefresh, setComentariosRefresh] = useState(0);
  const onNuevaPublicacion = useCallback(() => {
    // Incrementamos el contador para disparar la recarga en CommentList
    setComentariosRefresh((prev) => prev + 1);
  }, []);

  const [isBanned, setIsBanned] = useState(null); // null = cargando


  const handleToggleBan = async () => {
    if (!user) return;

    const endpoint = `${ENDPOINTS.USERS}/${user_thread_id}/toggle-ban`;



    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error en toggle ban");

      await fetchThread(); // actualiza los datos del usuario e hilo
    } catch (err) {
      console.error("Fallo en toggle ban:", err);
    }
  };


  // 1) Extraemos fetchThread como useCallback para poder invocarlo desde cualquier sitio.
const fetchThread = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINTS.THREADS}/${thread_id}`);
    if (!response.ok) throw new Error("Error al obtener el hilo");
    const data = await response.json();
    const threadData = Array.isArray(data) ? data[0] : data;
    if (!threadData) throw new Error("Hilo no encontrado");
    setThread(threadData);
    setVotes(threadData.votes);

    const responseUser = await fetch(`${ENDPOINTS.USERS}/${threadData.user_id}`);
    if (!responseUser.ok) throw new Error("Error al obtener autor del hilo");
    const dataUser = await responseUser.json();
    const userData = Array.isArray(dataUser) ? dataUser[0] : dataUser;

    // NUEVO: obtenemos is_banned del endpoint
    const isBanned = await fetchIsBannedStatus(threadData.user_id);
    userData.is_banned = isBanned;

    setUser(userData);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}, [thread_id]);


  // 2) Lo llamamos en el useEffect inicial
  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleVote = async (threadId, direction) => {
    setVotes(votes + (direction === "up" ? 1 : -1));
    try {
      const response = await fetch(`${ENDPOINTS.THREADS}/updateLike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, direction }),
      });
      if (!response.ok) throw new Error("Error al actualizar el voto");
    } catch (error) {
      console.error("Error al enviar voto:", error);
    }
  };

  // 3) Ahora este método cierra el hilo y luego vuelve a ejecutar fetchThread()
  const cerrarEsteHilo = async () => {
    await handleCloseThread(id, index);
    // Después de cerrar, forzamos un refetch para actualizar estado (is_closed, etc.)
    await fetchThread();
  };

  // 4) Método que cierra el hilo y luego vuelve a la pagina principal
  const borrarEsteHilo = async () => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este hilo?');
    if(!confirmar) return;

    await handleDeleteThread(id, index);
    navigate('/');
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <IconButton onClick={onBack} aria-label="volver">
                <ArrowBackIos />
              </IconButton>
              <img
                src={user?.img_link}
                alt={user?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{user?.username}</p>
                <p className="text-sm text-gray-400">{formatRelativeTime(thread.date)}</p>
              </div>
            </div>


            {/* Mostrar los botones de cerrar y eliminar solo si es el autor o un admin */}
            <div className="flex items-center gap-1">
                
            {(dbUser?.id === thread?.user_id || dbUser?.is_admin) && (
                <>
                  <BanUserButton user={user} onToggleBan={handleToggleBan} />
                  <CloseThreadButton thread={thread} onClose={cerrarEsteHilo} />
                  <DeleteThreadButton thread={thread} onDelete={borrarEsteHilo} />
                </>
            )}
            {console.log(dbUser)}

              <IconButton onClick={() => handleVote(thread.id, "up")} size="small">
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">{votes}</Typography>
              <IconButton onClick={() => handleVote(thread.id, "down")} size="small">
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          <h1 className="text-2xl font-bold p-2 mb-4">{thread.title}</h1>

          <div className="p-4 mb-4">
            <p className="mb-2">{thread.content}</p>
            {thread.img_link && (
              <img
                src={thread.img_link}
                alt={thread.tags}
                className="max-w-full rounded mt-2"
              />
            )}
          </div>

          <div className="flex flex-col gap-4 p-2">
            <p className="text-lg font-semibold text-center mb-0">Comentarios</p>
            <AddCommentInThread
              dbUser={dbUser}
              threadId={thread.id}
              isClosed={thread.is_closed}
              onCommentAdded={onNuevaPublicacion}
            />
            <CommentList
              threadId={thread.id}
              dbUser={dbUser}
              isClosed={thread.is_closed}
              refreshTrigger={comentariosRefresh}
            />
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
