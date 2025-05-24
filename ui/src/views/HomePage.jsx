import { useState, useEffect } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Autocomplete} from "@mui/material";

import ThreadCard from "../components/home-page-components/ThreadCard";
import { ENDPOINTS } from '../../constants';
import { CircularProgress } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

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
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("relevantes");
    const [page, setPage] = useState(1);
    const [totalThreads, setTotalThreads] = useState(0);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedTagQuery, setSelectedTagQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 10;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(`${ENDPOINTS.THREADS}/tags`);
                if (!response.ok) throw new Error("Error al obtener los tags");
                const data = await response.json();
                setTags(data.tags);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchTotalThreads = async () => {
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append("search", searchQuery);
                if (selectedTagQuery) params.append("tag", selectedTagQuery);

                const response = await fetch(`${ENDPOINTS.THREADS}/count?${params.toString()}`);
                if (!response.ok) throw new Error("Error al obtener el número total de hilos");

                const data = await response.json();
                setTotalThreads(data.total);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTotalThreads();
    }, [searchQuery, selectedTagQuery]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const offset = (page - 1) * limit;
                const params = new URLSearchParams({
                    limit: limit.toString(),
                    offset: offset.toString(),
                });

                if (searchQuery) params.append("search", searchQuery);
                if (selectedTagQuery) params.append("tag", selectedTagQuery);

                const response = await fetch(`${ENDPOINTS.THREADS}?${params.toString()}`);
                if (!response.ok) throw new Error("Error al obtener los posts");

                const threads = await response.json();

                const uniqueUserIds = [...new Set(threads.map(t => t.user_id))];
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
                    photo: userMap[thread.user_id]?.img_link || "",
                    tags: thread.tags || []
                }));

                setPosts(sortPosts(mappedPosts));
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los posts:", error);
            }
        };

        fetchPosts();
    }, [page, searchQuery, selectedTagQuery]);

    let totalPages
    if (totalThreads === 0) {
        totalPages = 1
    } else {
        totalPages = Math.ceil(totalThreads / limit);
    }
    

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearchSubmit = () => {
        setPage(1);
        setSearchQuery(searchText.trim());
        setSelectedTagQuery(selectedTag.trim());
    };

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
                    <Autocomplete
                        options={tags}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField {...params} label="Tags" variant="outlined" />
                        )}
                        className="w-[200px]"
                        onInputChange={(event, value) => {
                            setSelectedTag(value);
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearchSubmit}>
                    Buscar
                    </Button>
                </div>
            </div>

            { loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center gap-6">
                        {posts.map((post) => (
                            <ThreadCard
                                key={post.id}
                                post={post}
                                onVote={handleVote}
                            />
                        ))}
                    </div>
                     <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            variant="text"
                            className="min-w-0 p-2"
                        >
                            <ArrowBackIos />
                        </Button>

                        <span className="text-white">Página {page} de {totalPages}</span>

                        <Button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            variant="text"
                            className="min-w-0 p-2"
                        >
                            <ArrowForwardIos />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
