import { useEffect, useState } from "react";
import { Avatar, IconButton, Card, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ENDPOINTS } from '../../../constants';
import { useAuth0 } from "@auth0/auth0-react";

export default function ThreadCard({ post, onVote, onClick, user, isAuthenticated }) {
    const [liked, setLiked] = useState(false);
    const [userId, setUserID] = useState();
    const [postId, setPostId] = useState();
    const [highlight, setHighlight] = useState(false);
    const { loginWithRedirect } = useAuth0();

    // 1) Guardar user.id y post.id en el estado local
    useEffect(() => {
        if (user != null && post != null) {
            setUserID(user.id);
            setPostId(post.id);
        }
    }, [user, post]);

    // 2) Verificar si este hilo está en favoritos
    useEffect(() => {
        const fetchIsFavorito = async () => {
            try {
                const res = await fetch(`${ENDPOINTS.FAVORITES}/${userId}/${postId}`);
                const data = await res.json();
                setLiked(data.favorito);
            } catch (error) {
                console.error("Error al verificar si es favorito:", error);
            }
        };

        if (user && postId) {
            fetchIsFavorito();
        }
    }, [userId, postId]);

    // 3) Fetch de las ventajas del autor (post.user_id) y comprobación de "Destaca tus hilos"
    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                const res = await fetch(`${ENDPOINTS.BENEFITS}/${post.user_id}`);
                if (!res.ok) throw new Error("Error al obtener las ventajas del usuario");
                const benefits = await res.json();
                const now = new Date();

                // Buscar la ventaja "Destaca tus hilos" activa
                const hasHighlight = benefits.some((b) => {
                    if (b.name !== "Destaca tus hilos") return false;
                    const start = new Date(b.start_date);
                    const end = new Date(b.end_date);
                    return start <= now && now <= end;
                });

                setHighlight(hasHighlight);
            } catch (error) {
                console.error("Error al obtener ventajas:", error);
                setHighlight(false);
            }
        };

        if (post?.user_id) {
            fetchBenefits();
        }
    }, [post.user_id]);

    const toggleFavs = async (e) => {
        e.stopPropagation();
        const user_id = user.id;
        const thread_id = post.id;
        try {
            const res = await fetch(`${ENDPOINTS.FAVORITES}/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, thread_id }),
            });
            const data = await res.json();
            setLiked(data.favorito);
        } catch (error) {
            console.error("Error al alternar favorito:", error);
        }
    };

    const handleVote = (e, direction) => {
        e.stopPropagation();
        onVote(post.id, direction);
    };

    return (
        <Card
            className="w-full md:w-2/3 rounded-2xl shadow-md flex items-start justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg cursor-pointer"
            sx={{ px: 2, py: 1 }}
            onClick={() => onClick(post.id)}
        >
            <div className="flex flex-col items-center mr-4 mt-1 ">
                {isAuthenticated&&(
                <IconButton onClick={(e) => handleVote(e, "up")} size="small">
                    <ArrowUpwardIcon fontSize="small" />
                </IconButton>

                )}
                {!isAuthenticated&&(
                <IconButton className="disable" onClick={()=> {loginWithRedirect();}} size="small">
                    <ArrowUpwardIcon fontSize="small" />
                </IconButton>

                )}
                <Typography variant="body2">{post.votes}</Typography>
                {isAuthenticated&&(
                    
                <IconButton onClick={(e) => handleVote(e, "down")} size="small">
                    <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                )}
                {!isAuthenticated&&(
                    
                <IconButton onClick={()=> {loginWithRedirect();}} className="disable" size="small">
                    <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                )}
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Avatar src={post.photo} alt={post.user} sx={{ width: 24, height: 24 }} />
                    <span className="text-white font-medium">{post.user}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{post.time}</span>
                </div>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        mt: 0.5,
                        color: highlight ? "#90CAF9" : "inherit",
                    }}
                >
                    {post.title}
                </Typography>
            </div>

            <IconButton className="ml-4 mt-1" onClick={toggleFavs}>
                {liked ? <FavoriteIcon sx={{ color: "white" }} /> : <FavoriteBorderIcon />}
            </IconButton>
        </Card>
    );
}
