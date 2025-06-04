import { useState } from "react";
import { IconButton, Button, TextField, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ReplyIcon from "@mui/icons-material/Reply";
import { ENDPOINTS } from '../../../constants';
import { useAuth0 } from "@auth0/auth0-react"; // Asegúrate de importar esto si usas Auth0
const formatRelativeTime = (dateString) => {
    // Parsear como UTC aunque no tenga 'Z'
    const parts = dateString.match(/\d+/g);
    if (!parts) return 'fecha inválida';

    const date = new Date(Date.UTC(
        parts[0], // año
        parts[1] - 1, // mes (0-indexed)
        parts[2], // día
        parts[3] || 0, // hora
        parts[4] || 0, // minuto
        parts[5] || 0 // segundo
    ));

    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

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


export default function Comment({ comment, dbUser, threadId, isClosed }) {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [errorReplies, setErrorReplies] = useState("");
    const { loginWithRedirect } = useAuth0();

    const fetchReplies = async () => {
        setLoadingReplies(true);
        setErrorReplies("");
        try {
            const res = await fetch(`${ENDPOINTS.COMMENTS}/replies?comment_id=${comment.id}`);
            if (!res.ok) throw new Error("Error al obtener respuestas");
            const data = await res.json();
            setReplies(data);
        } catch (err) {
            console.error(err);
            setErrorReplies("No se pudieron cargar las respuestas.");
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleToggleReplies = () => {
        if (!showReplies && replies.length === 0) fetchReplies();
        setShowReplies(!showReplies);
    };

    const handleReplySubmit = async () => {
        try {
            const res = await fetch(`${ENDPOINTS.COMMENTS}/replie`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: replyContent,
                    user_id: dbUser.id,
                    thread_id: threadId,
                    comment_id: comment.id,
                }),
            });
            if (!res.ok) throw new Error("Error al enviar respuesta");
            setReplyContent("");
            setShowReplyBox(false);
            fetchReplies();
            setShowReplies(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReaction = async (type) => {
        if (!dbUser) {
            loginWithRedirect();
            return;
        }

        try {
            const res = await fetch(`${ENDPOINTS.COMMENTS}/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment_id: comment.id,
                    user_id: dbUser.id,
                }),
            });
            if (!res.ok) {
                const error = await res.json();
                console.error(error.detail || "Error al registrar reacción");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-neutral-800 border border-neutral-400 p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-start gap-4">
                <img src={comment.img_link} alt={comment.username} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{comment.username}</p>
                        <p className="text-sm text-gray-300">{formatRelativeTime(comment.date)}</p>
                    </div>
                    <p className="text-sm m-1 text-left"><span className="mr-2 text-neutral-500">|</span>{comment.content}</p>
                    <div className="flex gap-2 mt-2">
                        {dbUser&&(
                            <>
                            <IconButton size="small" onClick={() => handleReaction("like")}>
                            <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleReaction("dislike")}>
                            <ArrowDownwardIcon fontSize="small" />
                        </IconButton></>
                        )}
                        
                        
                        <IconButton size="small" onClick={() => {
                            if (!dbUser) {
                                loginWithRedirect();
                            } else if (!isClosed) {
                                setShowReplyBox(!showReplyBox);
                            }
                        }}
                            disabled={isClosed}
                            title={isClosed ? "El hilo está cerrado" : "Responder"}
                        >
                            <ReplyIcon fontSize="small" />
                        </IconButton>
                        <Button
                            size="small"
                            variant="text"
                            sx={{ textTransform: "none", color: "#ccc", paddingLeft: 0 }}
                            onClick={handleToggleReplies}
                            disabled={loadingReplies}
                        >
                            {showReplies ? "Ocultar respuestas" : "Ver respuestas"}
                        </Button>
                    </div>

                    {(showReplyBox && !dbUser.is_banned) && (
                        <div className="mt-3 space-y-2">
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                                size="small"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Escribe tu respuesta..."
                            />
                            <div className="flex gap-2">
                                <Button variant="contained" size="small" onClick={handleReplySubmit}>
                                    Enviar
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => setShowReplyBox(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}

                    {showReplies && (
                        <div className="mt-4 pl-6 border-l border-zinc-700 space-y-4">
                            {loadingReplies ? (
                                <div className="flex items-center gap-2 text-neutral-500">
                                    <CircularProgress size={16} /> Cargando respuestas...
                                </div>
                            ) : errorReplies ? (
                                <div className="text-red-500 text-sm">{errorReplies}</div>
                            ) : replies.length === 0 ? (
                                <div className=" text-center text-gray-300 text-sm">No hay respuestas aún.</div>
                            ) : (
                                replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3 text-sm bg-neutral-700 p-3 rounded">
                                        <img src={reply.img_link} alt={reply.username} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-semibold ">{reply.username} <span className="text-xs text-gray-400">· {formatRelativeTime(reply.date)}</span></p>
                                            <p className="text-left">{reply.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
