import { useState, useEffect } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import ThreadCard from "../components/home-page-components/ThreadCard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ENDPOINTS } from '../../constants';
import { CircularProgress, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Thread from "./Thread";
import { useAuth0 } from '@auth0/auth0-react';

const sortPosts = (posts) => {
  return [...posts].sort((a, b) => b.votes - a.votes);
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

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
  const [selectedThread, setSelectedThread] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [likeFilter, setLikeFilter] = useState(false);
  const { user: auth0User, isAuthenticated } = useAuth0();
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Si la URL es /thread/:id preseleccionamos ese hilo
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/thread\/(.+)$/);
    if (match) {
      setSelectedThread(match[1]);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    setTotalPages(totalThreads === 0 ? 1 : Math.ceil(totalThreads / limit));
  }, [totalThreads]);

  // 1) Comprobar o crear el usuario en BD
  useEffect(() => {
    const checkOrCreateUser = async () => {
      setLoading(true);
      if (!auth0User?.email) return;

      try {
        const res = await fetch(`${ENDPOINTS.USERS}?email=${auth0User.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setDbUser(data[0]);
            setLoading(false);
            return;
          }
        }
        // Si no existe, lo creamos
        const newUser = {
          fullname: auth0User.name,
          username: auth0User.nickname,
          email: auth0User.email,
          img_link: auth0User.picture,
          is_admin: false,
          reputation: 0,
          score: 0,
          password: "google"
        };
        const createRes = await fetch(`${ENDPOINTS.USERS}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!createRes.ok) throw new Error("Error al crear usuario");
        // No necesitamos leer la respuesta: en siguiente render effect nos llega dbUser
      } catch (error) {
        console.error("Error al comprobar o crear usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOrCreateUser();
  }, [auth0User]);

  // 2) Fetch de threads favoritos (si likeFilter=true)
  useEffect(() => {
    const fetchFavoriteThreads = async () => {
      if (!likeFilter || !dbUser) return;
      setLoading(true);
      try {
        const res = await fetch(`${ENDPOINTS.FAVORITES}/${dbUser.id}`);
        if (!res.ok) throw new Error("Error al obtener favoritos");

        const { thread_ids } = await res.json();
        if (thread_ids.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const params = new URLSearchParams();
        thread_ids.forEach(id => params.append("thread_ids", id));

        const threadsRes = await fetch(`${ENDPOINTS.THREADS}/by_ids?${params.toString()}`);
        if (!threadsRes.ok) throw new Error("Error al obtener threads favoritos");

        const threads = await threadsRes.json();
        const uniqueUserIds = [...new Set(threads.map(t => t.user_id))];
        const userMap = {};

        await Promise.all(uniqueUserIds.map(async (userId) => {
          const res2 = await fetch(`${ENDPOINTS.USERS}/${userId}`);
          if (res2.ok) {
            const userData2 = await res2.json();
            if (userData2[0]) {
              userMap[userId] = {
                username: userData2[0].username,
                img_link: userData2[0].img_link,
                email: userData2[0].email,
                id: userData2[0].id,
                is_admin: userData2[0].is_admin
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
          tags: thread.tags || [],
          user_email: userMap[thread.user_id]?.email || "",
          user_id: thread.user_id
        }));

        setPosts(sortPosts(mappedPosts));
      } catch (error) {
        console.error("Error al obtener threads favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (likeFilter) {
      setPage(1);
      setTotalPages(1);
      fetchFavoriteThreads();
    }
  }, [likeFilter, dbUser]);

  // 3) Fetch de tags disponibles
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
    };
    fetchTags();
  }, []);

  // 4) Fetch del total de threads (para paginación)
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

  // 5) Fetch de posts paginados (o búsqueda / filtro por tag)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
        if (searchQuery) params.append("search", searchQuery);
        if (selectedTagQuery) params.append("tag", selectedTagQuery);

        const response = await fetch(`${ENDPOINTS.THREADS}?${params.toString()}`);
        if (!response.ok) throw new Error("Error al obtener los posts");

        const threads = await response.json();
        const uniqueUserIds = [...new Set(threads.map(t => t.user_id))];
        const userMap = {};

        await Promise.all(uniqueUserIds.map(async (userId) => {
          const res2 = await fetch(`${ENDPOINTS.USERS}/${userId}`);
          if (res2.ok) {
            const userData2 = await res2.json();
            if (userData2[0]) {
              userMap[userId] = {
                username: userData2[0].username,
                img_link: userData2[0].img_link,
                email: userData2[0].email,
                id: userData2[0].id,
                is_admin: userData2[0].is_admin
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
          tags: thread.tags || [],
          user_email: userMap[thread.user_id]?.email || "",
          user_id: thread.user_id
        }));

        setPosts(sortPosts(mappedPosts));
      } catch (error) {
        console.error("Error al obtener los posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!likeFilter) {
      fetchPosts();
    }
  }, [page, searchQuery, selectedTagQuery, selectedThread, likeFilter]);

  const toggleFilterFavs = () => {
    setLikeFilter(prev => !prev);
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: id, direction }),
      });
      if (!response.ok) throw new Error("Error al actualizar el voto");
    } catch (error) {
      console.error("Error al enviar voto:", error);
    }
  };

  // --- NUEVO handleCloseThread: recibe (threadId, index) desde <Thread />,
  //     pero en HomePage vamos a “buscar” ese índice en posts[], actualizarlo y hacer refetch
  const handleCloseThread = async (threadId, indexParam) => {
    // 1) Si el hijo le pasó indexParam “undefined”, recalculamos:
    let index = indexParam;
    if (typeof index !== "number" || index < 0 || index >= posts.length) {
      index = posts.findIndex(p => p.id === threadId);
    }
    if (index === -1) {
      console.warn("No se encontró el hilo en el array de posts:", threadId);
      return;
    }

    // 2) Verificamos si no está ya cerrado
    if (posts[index]?.is_closed) {
      alert("Este hilo ya está cerrado.");
      return;
    }

    try {
      const res = await fetch(`${ENDPOINTS.THREADS}/${threadId}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Error cerrando el hilo');
      }
      const updatedThread = await res.json();

      // 3) Actualizamos el estado “posts” en HomePage
      setPosts(prev => {
        const copia = [...prev];
        // Fusionamos la respuesta actualizada (puede incluir is_closed: true, etc.)
        copia[index] = { ...copia[index], ...updatedThread };
        return copia;
      });
    } catch (err) {
      console.error(err);
      alert(`No se pudo cerrar el hilo: ${err.message}`);
    }
  };
    const handleDeleteThread = async (threadId, indexParam) => {
  // 1) Si el hijo le pasó indexParam inválido, recalculamos:
  let index = indexParam;
  if (typeof index !== "number" || index < 0 || index >= posts.length) {
    index = posts.findIndex((p) => p.id === threadId);
  }
  if (index === -1) {
    console.warn("No se encontró el hilo en el array de posts:", threadId);
    return;
  }

  try {
    const res = await fetch(`${ENDPOINTS.THREADS}/${threadId}`, {
      method: "DELETE",
    });

    if (res.status === 204) {
      // Borrado exitoso: removemos del array
      setPosts((prev) => prev.filter((_, i) => i !== index));

      // Si tenías el hilo seleccionado en detalle, volvemos al listado
      if (selectedThread === threadId) {
        setSelectedThread(null);
      }
    } else {
      const errJson = await res.json();
      throw new Error(errJson.detail || "Error al eliminar el hilo");
    }
  } catch (err) {
    console.error(err);
    alert(`No se pudo eliminar el hilo: ${err.message}`);
  }
};


  return (
    <>
      {selectedThread ? (
        // Cuando hay un hilo seleccionado, pasamos tanto “id” como “index” al componente <Thread />
        (() => {
          const selIndex = posts.findIndex(p => p.id === selectedThread);
          return (
            <Thread
              id={selectedThread}
              index={selIndex}
              onBack={() => setSelectedThread(null)}
              dbUser={dbUser}
              handleCloseThread={handleCloseThread}
              handleDeleteThread={handleDeleteThread}
              user_thread_id={posts[selIndex].user_id}
            />
          );
        })()
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full md:w-2/3 flex gap-4  justify-center align-middle items-center">
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
              {isAuthenticated&&(
                <IconButton className="ml-4 mt-1 w-8 h-8 flex justify-center align-middle items-center" onClick={toggleFilterFavs}>
                {likeFilter ? (
                  <FavoriteIcon className="w-8 h-8" sx={{ color: "white" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              )}
              <Button className="h-13" variant="contained" color="primary" onClick={handleSearchSubmit}>
                Buscar
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-6">
                {posts.map((post, idx) => (
                  <ThreadCard
                    key={post.id}
                    post={post}
                    onVote={handleVote}
                    onClick={() => setSelectedThread(post.id)}
                    user={dbUser}
                    isAuthenticated = {isAuthenticated}
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
      )}
    </>
  );
}
