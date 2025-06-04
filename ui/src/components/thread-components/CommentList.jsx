// CommentList.jsx

import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../../constants";
import Comment from "./Comment";
import { CircularProgress } from "@mui/material";

export default function CommentList({ threadId, dbUser, isClosed, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${ENDPOINTS.COMMENTS}/list?thread_id=${threadId}`);
        if (!res.ok) throw new Error("Error al cargar comentarios");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, refreshTrigger]);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          dbUser={dbUser}
          threadId={threadId}
          isClosed={isClosed}
        />
      ))}
    </div>
  );
}
