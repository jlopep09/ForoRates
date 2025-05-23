--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-08 12:16:53

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: benefits; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.benefits OWNER TO root;

--
-- TOC entry 216 (class 1259 OID 16403)
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
-- TOC entry 217 (class 1259 OID 16404)
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
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN comments.comment_id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';


--
-- TOC entry 218 (class 1259 OID 16409)
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
-- TOC entry 219 (class 1259 OID 16410)
-- Name: favorites; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.favorites OWNER TO root;

--
-- TOC entry 220 (class 1259 OID 16413)
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
-- TOC entry 221 (class 1259 OID 16414)
-- Name: notifications; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    id_user integer NOT NULL,
    date date NOT NULL,
    seen boolean DEFAULT false
);


ALTER TABLE public.notifications OWNER TO root;

--
-- TOC entry 222 (class 1259 OID 16420)
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
-- TOC entry 223 (class 1259 OID 16421)
-- Name: threads; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.threads (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_closed boolean NOT NULL,
    img_link text,
    user_id integer NOT NULL,
    date date NOT NULL,
    tags text NOT NULL
);


ALTER TABLE public.threads OWNER TO root;

--
-- TOC entry 224 (class 1259 OID 16426)
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
-- TOC entry 225 (class 1259 OID 16427)
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
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO root;

--
-- TOC entry 226 (class 1259 OID 16432)
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
-- TOC entry 3392 (class 0 OID 16398)
-- Dependencies: 215
-- Data for Name: benefits; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
\.


--
-- TOC entry 3394 (class 0 OID 16404)
-- Dependencies: 217
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
\.


--
-- TOC entry 3396 (class 0 OID 16410)
-- Dependencies: 219
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.favorites (id, thread_id, user_id) FROM stdin;
\.


--
-- TOC entry 3398 (class 0 OID 16414)
-- Dependencies: 221
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.notifications (id, title, content, category, id_user, date, seen) FROM stdin;
\.


--
-- TOC entry 3400 (class 0 OID 16421)
-- Dependencies: 223
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags) FROM stdin;
8	thread 1	Este es el contenido	f	https://static01.nyt.com/images/2025/03/25/multimedia/17tb-iguanas-gwpk/17tb-iguanas-gwpk-superJumbo.jpg?quality=75&auto=webp	4	2024-01-01	iguana
\.


--
-- TOC entry 3402 (class 0 OID 16427)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email, password) FROM stdin;
4	t	Jose antonio	jlopep09	100	https://catfriendly.com/wp-content/uploads/2025/02/h5n1-w3.jpg	87	jlopep09@gmail.com	123456
\.


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 216
-- Name: benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.benefits_id_seq', 1, false);


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 218
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 220
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 222
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 224
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.threads_id_seq', 8, true);


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3228 (class 2606 OID 16434)
-- Name: benefits benefits_name; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);


--
-- TOC entry 3232 (class 2606 OID 16436)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16438)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 16440)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3230 (class 2606 OID 16442)
-- Name: benefits pk_benefits; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 16444)
-- Name: threads thread_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 16446)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 16447)
-- Name: threads FK_thread_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3241 (class 2606 OID 16452)
-- Name: benefits fk_benefits_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3242 (class 2606 OID 16457)
-- Name: comments fk_comments_comment; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;


--
-- TOC entry 3243 (class 2606 OID 16462)
-- Name: comments fk_comments_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- TOC entry 3244 (class 2606 OID 16467)
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3245 (class 2606 OID 16472)
-- Name: favorites fk_favorites_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- TOC entry 3246 (class 2606 OID 16477)
-- Name: favorites fk_favorites_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3247 (class 2606 OID 16482)
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;


-- Completed on 2025-05-08 12:17:01

--
-- PostgreSQL database dump complete
--

