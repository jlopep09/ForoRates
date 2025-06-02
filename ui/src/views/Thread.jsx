import { useEffect, useState } from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ENDPOINTS } from "../../constants";
import { CircularProgress} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton, Typography } from "@mui/material";
import {ArrowBackIos } from "@mui/icons-material";
import AddCommentInThread from "../components/thread-components/AddCommentInThread";
import CommentList from "../components/thread-components/CommentList";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // diferencia en segundos

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


export default function Thread({ id, onBack, dbUser }) {

    console.log("::::::::db user:::::",dbUser);

    const thread_id = id;

    const [thread, setThread] = useState([]);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [votes, setVotes] = useState();

    useEffect(() => {
        const fetchThread = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                const response = await fetch(`${ENDPOINTS.THREADS}/${thread_id}`);

                if (!response.ok) throw new Error("Error al obtener el hilo");

                const data = await response.json();

                const threadData = Array.isArray(data) ? data[0] : data;
                if(!threadData) {
                    throw new Error("Hilo no encontrado en la respuesta");
                }

                setThread(threadData)//setThread(data[0]);
                setVotes(threadData.votes)//setVotes(data[0].votes)
                console.log(data)//console.log(data)[0]

                const responseUser = await fetch(`${ENDPOINTS.USERS}/${threadData.user_id}`);
                if(!responseUser.ok) throw new Error("Error al obtener autor del hilo");

                const dataUser = await responseUser.json();
                const userData = Array.isArray(dataUser) ? dataUser[0] : dataUser;
                setUser(userData);

                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchThread();
    }, [])

    const handleVote = async (id, direction) => {
        setVotes(votes + (direction === "up" ? 1 : -1))
        try {
            const response = await fetch(`${ENDPOINTS.THREADS}/updateLike`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ thread_id: id, direction }),
            });

            if (!response.ok) throw new Error("Error al actualizar el voto");
            
        } catch (error) {
            console.error("Error al enviar voto:", error);
        }
    };

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

                        <div className="flex items-center gap-1">
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
                        <AddCommentInThread dbUser={dbUser} threadId={thread?.id} isClosed={thread?.is_closed} />
                        <CommentList threadId={thread.id} dbUser={dbUser} />
                    </div>
                </div>
            )}
            </ThemeProvider>
    )
}