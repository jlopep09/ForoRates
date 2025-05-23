import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import ThreadCard from "../components/home-page-components/ThreadCard";
import { ENDPOINTS } from '../../constants';

const sortPosts = (posts) => {
    return [...posts].sort((a, b) => b.votes - a.votes);
};

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


export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${ENDPOINTS.THREADS}?limit=50&offset=0`);
                if (!response.ok) throw new Error("Error al obtener los posts");
                const threads = await response.json();

                // Obtenemos usuarios únicos
                const uniqueUserIds = [...new Set(threads.map(t => t.user_id))];

                // Obtenemos info de todos los usuarios en paralelo
                const userMap = {};
                await Promise.all(uniqueUserIds.map(async (userId) => {
                    const res = await fetch(`${ENDPOINTS.USERS}/${userId}`);
                    if (res.ok) {
                        const userData = await res.json();
                        if (userData[0]) {
                            userMap[userId] = {
                                username: userData[0].username,
                                img_link: userData[0].img_link
                            };
                        }
                    }
                }));

                const mappedPosts = threads.map((thread) => ({
                    id: thread.id,
                    title: thread.title,
                    votes: thread.votes,
                    user: userMap[thread.user_id]?.username || `usuario_${thread.user_id}`,
                    time: formatRelativeTime(thread.date),
                    photo: userMap[thread.user_id]?.img_link || ""
                }));

                setPosts(sortPosts(mappedPosts));
            } catch (error) {
                console.error("Error al obtener los posts:", error);
            }
        };

        fetchPosts();
    }, []);


    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleVote = async (id, direction) => {
        const updated = posts.map(post =>
            post.id === id
                ? { ...post, votes: post.votes + (direction === "up" ? 1 : -1) }
                : post
        );
        setPosts(sortPosts(updated));
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
        <div className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-full md:w-2/3 flex gap-4">
                    <TextField
                        variant="outlined"
                        placeholder="Buscar publicaciones..."
                        fullWidth
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <Button variant="contained" color="primary">
                        Buscar
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                {filteredPosts.map((post) => (
                    <ThreadCard
                        key={post.id}
                        post={post}
                        onVote={handleVote}
                    />
                ))}
            </div>
        </div>
    );
}
