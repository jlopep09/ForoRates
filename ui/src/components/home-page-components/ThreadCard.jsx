import { useState } from "react";
import { Avatar, IconButton, Card, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function ThreadCard({ post, onVote, onClick }) {
    const [liked, setLiked] = useState(false);

    const toggleLike = () => setLiked(!liked);

    return (
        <Card
            className="w-full md:w-2/3 rounded-2xl shadow-md flex items-start justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg cursor-pointer"
            sx={{ px: 2, py: 1 }}
            onClick={() => onClick(post.id)}
        >
            <div className="flex flex-col items-center mr-4 mt-1" >
                <IconButton onClick={() => onVote(post.id, "up")} size="small">
                    <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2">{post.votes}</Typography>
                <IconButton onClick={() => onVote(post.id, "down")} size="small">
                    <ArrowDownwardIcon fontSize="small" />
                </IconButton>
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Avatar src={post.photo} alt={post.user} sx={{ width: 24, height: 24 }} />
                    <span className="text-white font-medium">{post.user}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{post.time}</span>
                </div>

                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left", mt: 0.5 }}>
                    {post.title}
                </Typography>
            </div>

            <IconButton className="ml-4 mt-1" onClick={toggleLike}>
                {liked ? (
                    <FavoriteIcon sx={{ color: "white" }} />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
        </Card>
    );
}
