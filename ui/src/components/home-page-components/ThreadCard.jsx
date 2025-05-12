import { Avatar, Button, Card, IconButton, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function ThreadCard({ post }) {
    return (
        <Card
            className="w-full md:w-2/3 rounded-2xl shadow-md flex items-start justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg cursor-pointer"
            sx={{ px: 2, py: 1 }} // padding reducido
        >
            {/* Votos */}
            <div className="flex flex-col items-center mr-4 mt-1">
                <IconButton size="small">
                    <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2">{post.votos}</Typography>
                <IconButton size="small">
                    <ArrowDownwardIcon fontSize="small" />
                </IconButton>
            </div>

            {/* Contenido principal */}
            <div className="flex-grow">
                {/* Usuario y tiempo */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Avatar src={post.foto} alt={post.usuario} sx={{ width: 24, height: 24 }} />
                    <span className="text-black font-medium">{post.usuario}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{post.tiempo}</span>
                </div>

                {/* Título */}
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left", mt: 0.5 }}>
                    {post.titulo}
                </Typography>
            </div>

            {/* Favoritos */}
            <IconButton className="ml-4 mt-1">
                <FavoriteBorderIcon />
            </IconButton>
        </Card>
    );
}
