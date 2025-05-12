import { TextField, Button, Card, CardContent, CardActions, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ThreadCard from "../components/home-page-components/ThreadCard";

const getPost = () => {
    const posts = [
        { id: 1, votos: 12, usuario: "manolo", tiempo: "hace 12h", titulo: "¿Vale la pena aprender Rust en 2025?", foto: "" },
        { id: 2, votos: 67, usuario: "ana_dev", tiempo: "hace 3h", titulo: "Me he pasado a Neovim y no hay vuelta atrás 😍", foto: "" },
        { id: 3, votos: -4, usuario: "elias2024", tiempo: "hace 1d", titulo: "Typescript está sobrevalorado. Lo dije.", foto: "" },
        { id: 4, votos: 29, usuario: "luciaux", tiempo: "hace 45min", titulo: "¿Consejos para empezar en freelancing como front?", foto: "" },
        { id: 5, votos: 0, usuario: "pablito23", tiempo: "hace 5h", titulo: "Estoy haciendo un clon de Reddit en React + Firebase 🔥", foto: "" },
        { id: 6, votos: 83, usuario: "marina_k", tiempo: "hace 2d", titulo: "10 VSCode extensiones que me salvaron el máster", foto: "" },
        { id: 7, votos: 18, usuario: "debugQueen", tiempo: "hace 6h", titulo: "¿Cómo explicar a tus padres qué haces como dev?", foto: "" },
        { id: 8, votos: 3, usuario: "sergio_ai", tiempo: "hace 20min", titulo: "Estoy haciendo un bot que escribe reggaetón con GPT", foto: "" }
    ];
    return posts;
}

export default function HomePage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-full md:w-2/3 flex gap-4">
                    <TextField 
                        variant="outlined" 
                        placeholder="Buscar publicaciones..." 
                        fullWidth 
                    />
                    {/*
                    <div className="w-full md:w-2/3 mx-auto">
                        <FormControl fullWidth>
                            <InputLabel id="filtro-label">Filtrar por</InputLabel>
                            <Select labelId="filtro-label" defaultValue="">
                                <MenuItem value="recientes">Recientes</MenuItem>
                                <MenuItem value="mas_votadas">Más votadas</MenuItem>
                                <MenuItem value="favoritas">Favoritas</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    */}
                    <Button variant="contained" color="primary">
                        Buscar
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                {getPost().map((post) => (
                    <ThreadCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
