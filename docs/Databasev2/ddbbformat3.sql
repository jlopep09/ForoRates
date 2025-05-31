--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-31 17:32:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

--
-- TOC entry 2 (class 3079 OID 16495)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16398)
-- Name: benefits; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.benefits OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 16403)
-- Name: benefits_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.benefits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.benefits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16404)
-- Name: comments; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    likes integer,
    dislikes integer,
    content text NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    comment_id integer
);


ALTER TABLE public.comments OWNER TO root;

--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN comments.comment_id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';


--
-- TOC entry 219 (class 1259 OID 16409)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16410)
-- Name: favorites; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.favorites OWNER TO root;

--
-- TOC entry 221 (class 1259 OID 16413)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.favorites ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16414)
-- Name: notifications; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    id_user integer NOT NULL,
    seen boolean DEFAULT false,
    id_thread integer
);


ALTER TABLE public.notifications OWNER TO root;

--
-- TOC entry 223 (class 1259 OID 16420)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16421)
-- Name: threads; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.threads (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_closed boolean NOT NULL,
    img_link text,
    user_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tags text NOT NULL,
    votes integer DEFAULT 0
);


ALTER TABLE public.threads OWNER TO root;

--
-- TOC entry 225 (class 1259 OID 16426)
-- Name: threads_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16427)
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    is_admin boolean NOT NULL,
    fullname text NOT NULL,
    username text NOT NULL,
    score integer NOT NULL,
    img_link text,
    reputation integer NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.users OWNER TO root;

--
-- TOC entry 227 (class 1259 OID 16432)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3409 (class 0 OID 16398)
-- Dependencies: 216
-- Data for Name: benefits; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
5	string	100	2025-05-31 14:55:50.294	2025-05-31 14:55:50.294	12
\.


--
-- TOC entry 3411 (class 0 OID 16404)
-- Dependencies: 218
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
\.


--
-- TOC entry 3413 (class 0 OID 16410)
-- Dependencies: 220
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.favorites (id, thread_id, user_id) FROM stdin;
9	20	11
11	18	11
\.


--
-- TOC entry 3415 (class 0 OID 16414)
-- Dependencies: 222
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.notifications (id, title, content, id_user, seen, id_thread) FROM stdin;
\.


--
-- TOC entry 3417 (class 0 OID 16421)
-- Dependencies: 224
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags, votes) FROM stdin;
10	Reseña del libro “El problema de los tres cuerpos”	No suelo leer ciencia ficción, pero este libro me atrapó. La forma en que mezcla ciencia, política y misterio es fascinante. Muy recomendable para quienes les gusta el pensamiento abstracto.	f		8	2025-04-03 18:45:00	libros, ciencia ficción, literatura	14
11	Opinión sobre el documental “The Social Dilemma”	Este documental me hizo replantearme mi uso de las redes sociales. Muy potente en su mensaje, aunque algo dramático. Ideal para abrir debate.	f	https://m.media-amazon.com/images/M/MV5BNWY5ZjUxNzItMjg1NS00MzU5LTk0YjMtNTkwNzljNjU2NjdmXkEyXkFqcGdeQXVyMjI3NDAyNg@@._V1_FMjpg_UX1000_.jpg	9	2025-03-29 10:00:00	documentales, sociedad, netflix	8
12	Mi experiencia en el restaurante Casa Lucio (Madrid)	Fuimos por las famosas “huevos rotos”. El ambiente es muy tradicional, el servicio atento y la comida deliciosa. No es barato, pero vale la pena si visitas Madrid.	f		10	2025-04-10 20:10:00	gastronomía, madrid, restaurantes	18
14	Probando café de especialidad en León	Fui a “Tostado Café Club” y probé un café etíope. El sabor era cítrico, muy distinto a lo comercial. Si os gusta el café, merece la pena explorar estos sitios.	f		9	2025-05-01 11:30:00	café, león, gastronomía	11
16	¿Merece la pena suscribirse a ChatGPT Plus?	Llevo un mes probando GPT-4 y sí, se nota diferencia frente a la versión gratuita. Es más preciso, más rápido y permite usos más complejos. Ideal si lo usas para trabajar o estudiar.	f		10	2025-04-05 13:10:00	IA, productividad, software	25
17	Mi primera experiencia con realidad virtual (Meta Quest 3)	Fue muy inmersivo, aunque algo mareante al principio. Jugar a Beat Saber es divertidísimo. Recomendado si te gustan los videojuegos y la tecnología.	f		9	2025-05-05 16:00:00	realidad virtual, gaming, meta	17
13	Review: Zelda Tears of the Kingdom	Increíble cómo han evolucionado los juegos de mundo abierto. Nintendo se ha superado. La historia es envolvente y la jugabilidad te engancha desde el minuto uno.	f	https://cdn.vox-cdn.com/thumbor/XDK0jC3VWdUtiAO5IVFdS0_Wynk=/0x0:2040x1360/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/24634881/DSCF1675.jpg	7	2025-04-15 17:00:00	videojuegos, nintendo, zelda	35
15	Mi review del Tesla Model 3 tras 6 meses	Silencioso, rápido, cómodo. Pero hay que tener claro que dependes mucho de los puntos de carga. Aún así, muy buena experiencia general.	f	https://electrek.co/wp-content/uploads/sites/3/2021/11/tesla-model-3-hero.jpg	12	2025-02-15 09:40:00	automoción, coches eléctricos, tecnología	30
9	Probando el nuevo iPhone 15 Pro Max	Después de una semana de uso, la batería me ha sorprendido gratamente. El rendimiento es increíble y la cámara mejora mucho con poca luz. Aunque el precio es alto, si te gusta Apple, merece la pena.	f	https://cdn.macrumors.com/article-new/2023/iphone15promax.jpg	7	2025-04-01 15:20:00	tecnología, apple, móviles	22
18	Opinión sobre “Dune: Parte 2” (sin spoilers)	Visualmente espectacular, Denis Villeneuve lo vuelve a hacer. La historia fluye mejor que en la primera. Recomendable ver en cine por el sonido y efectos.	f	https://cdn.mos.cms.futurecdn.net/QToiXn5a8M7R5tWWeqHVnD.jpg	8	2025-03-10 19:50:00	cine, ciencia ficción, dune	43
19	Explorando el mundo de los vinos naturales	Probé un vino natural francés en una cata y fue una experiencia totalmente diferente. Sabores más salvajes, menos dulces, pero muy auténticos. Ideal para quienes buscan algo distinto.	f	https://images.unsplash.com/photo-1600891964599-f61ba0e24092	10	2025-05-10 18:30:00	vino, gastronomía, experiencias	12
20	¿Por qué todos hablan de “3 Body Problem” en Netflix?	Vi los primeros episodios y aunque es denso, me atrapó la producción y la intriga. Si te gustó Dark o Black Mirror, probablemente te enganche también.	f		8	2025-05-12 21:00:00	series, ciencia ficción, netflix	27
21	Probando alternativas a Notion: mi experiencia con Obsidian	Empecé a usar Obsidian para mis notas de estudio y la libertad que da en la organización es brutal. La curva de aprendizaje existe, pero vale la pena.	f		7	2025-05-15 09:20:00	productividad, software, notas	19
22	Senderismo por los Picos de Europa: Ruta del Cares	Una de las rutas más espectaculares que he hecho. Paisajes brutales, eso sí, hay que llevar buen calzado y agua. Ideal para primavera.	f	https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Cares_Gorge%2C_Asturias_and_Le%C3%B3n_%28Spain%29.jpg/800px-Cares_Gorge%2C_Asturias_and_Le%C3%B3n_%28Spain%29.jpg	9	2025-05-11 07:45:00	naturaleza, viajes, senderismo	23
23	¿Qué auriculares inalámbricos me recomiendan?	Estoy entre los Sony WH-1000XM5 y los Bose 700. Busco buena cancelación de ruido, comodidad y calidad de sonido. ¿Alguien los ha probado?	f		8	2025-05-14 14:10:00	tecnología, audio, recomendaciones	6
\.


--
-- TOC entry 3419 (class 0 OID 16427)
-- Dependencies: 226
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email) FROM stdin;
7	f	Lucia	lucia_tech	50	https://randomuser.me/api/portraits/women/44.jpg	10	lucia@example.com
8	f	Marco	marco_reader	70	https://randomuser.me/api/portraits/men/33.jpg	45	marco@example.com
9	f	Ana	ana_explora	100	https://randomuser.me/api/portraits/women/66.jpg	0	ana@example.com
10	f	David	david_foodie	0	https://randomuser.me/api/portraits/men/21.jpg	32	david@example.com
11	f	David González Álvarez	dgonza11	0	https://lh3.googleusercontent.com/a/ACg8ocI0SMAkpDrcIdPzS8czNy0M3BKoc-vs6I2BktklEOH5TxCnOg=s96-c	0	dgonza11@estudiantes.unileon.es
12	f	Jositos Lopez	jositoslopez	900	https://static01.nyt.com/images/2025/03/25/multimedia/17tb-iguanas-gwpk/17tb-iguanas-gwpk-superJumbo.jpg?quality=75&auto=webp	0	jositoslopez@gmail.com
60	f	Jose López perez	jose.lppz03	0	https://lh3.googleusercontent.com/a/ACg8ocKOL5i7e6HHnXJeLQZ3zGoDUZ3xgCDUGK0EJyWHGYWIRNb5_-s=s96-c	0	jose.lppz03@gmail.com
\.


--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 217
-- Name: benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.benefits_id_seq', 5, true);


--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 219
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 221
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.favorites_id_seq', 13, true);


--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 223
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);


--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 225
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.threads_id_seq', 23, true);


--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 61, true);


--
-- TOC entry 3243 (class 2606 OID 16434)
-- Name: benefits benefits_name; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);


--
-- TOC entry 3247 (class 2606 OID 16436)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 16438)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 16440)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 16442)
-- Name: benefits pk_benefits; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);


--
-- TOC entry 3253 (class 2606 OID 16444)
-- Name: threads thread_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 16513)
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 3257 (class 2606 OID 16446)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 16447)
-- Name: threads FK_thread_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3258 (class 2606 OID 16452)
-- Name: benefits fk_benefits_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3259 (class 2606 OID 16457)
-- Name: comments fk_comments_comment; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;


--
-- TOC entry 3260 (class 2606 OID 16462)
-- Name: comments fk_comments_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- TOC entry 3261 (class 2606 OID 16467)
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3262 (class 2606 OID 16472)
-- Name: favorites fk_favorites_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- TOC entry 3263 (class 2606 OID 16477)
-- Name: favorites fk_favorites_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3264 (class 2606 OID 16482)
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 229
-- Name: FUNCTION unaccent(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unaccent(text) TO root;


--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 228
-- Name: FUNCTION unaccent(regdictionary, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO root;


--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 230
-- Name: FUNCTION unaccent_init(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unaccent_init(internal) TO root;


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 231
-- Name: FUNCTION unaccent_lexize(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO root;


--
-- TOC entry 2071 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO root;


--
-- TOC entry 2073 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO root;


--
-- TOC entry 2072 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO root;


--
-- TOC entry 2070 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO root;


-- Completed on 2025-05-31 17:32:14

--
-- PostgreSQL database dump complete
--

