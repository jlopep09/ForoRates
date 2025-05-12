import { useState } from "react";
import { TextField, Button } from "@mui/material";
import ThreadCard from "../components/home-page-components/ThreadCard";

const initialPosts = [
    { id: 1, votes: 12, user: "manolo", time: "hace 12h", title: "¿Vale la pena aprender Rust en 2025?", photo: "" },
    { id: 2, votes: 67, user: "ana_dev", time: "hace 3h", title: "Me he pasado a Neovim y no hay vuelta atrás 😍", photo: "" },
    { id: 3, votes: -4, user: "elias2024", time: "hace 1d", title: "Typescript está sobrevalorado. Lo dije.", photo: "" },
    { id: 4, votes: 29, user: "luciaux", time: "hace 45min", title: "¿Consejos para empezar en freelancing como front?", photo: "" },
    { id: 5, votes: 0, user: "pablito23", time: "hace 5h", title: "Estoy haciendo un clon de Reddit en React + Firebase 🔥", photo: "" },
    { id: 6, votes: 83, user: "marina_k", time: "hace 2d", title: "10 VSCode extensiones que me salvaron el máster", photo: "" },
    { id: 7, votes: 18, user: "debugQueen", time: "hace 6h", title: "¿Cómo explicar a tus padres qué haces como dev?", photo: "" },
    { id: 8, votes: 3, user: "sergio_ai", time: "hace 20min", title: "Estoy haciendo un bot que escribe reggaetón con GPT", photo: "" }
];

const sortPosts = (posts) => {
    return [...posts].sort((a, b) => b.votes - a.votes);
};

export default function HomePage() {
    const [posts, setPosts] = useState(sortPosts(initialPosts));
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );



    const handleVote = (id, direction) => {
        const updated = posts.map(post =>
            post.id === id
                ? { ...post, votes: post.votes + (direction === "up" ? 1 : -1) }
                : post
        );
        setPosts(sortPosts(updated));
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
