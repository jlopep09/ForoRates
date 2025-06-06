toc.dat                                                                                             0000600 0004000 0002000 00000034467 15007102334 0014450 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   ;                    }           fororatesdb    16.8 (Debian 16.8-1.pgdg120+1)    17.2 2    T           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false         U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false         V           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false         W           1262    16389    fororatesdb    DATABASE     v   CREATE DATABASE fororatesdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE fororatesdb;
                     root    false         X           0    0    fororatesdb    DATABASE PROPERTIES     4   ALTER DATABASE fororatesdb SET "TimeZone" TO 'utc';
                          root    false                     2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     root    false         �            1259    16398    benefits    TABLE     �   CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.benefits;
       public         heap r       root    false    5         �            1259    16403    benefits_id_seq    SEQUENCE     �   ALTER TABLE public.benefits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.benefits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    215         �            1259    16404    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    likes integer,
    dislikes integer,
    content text NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    comment_id integer
);
    DROP TABLE public.comments;
       public         heap r       root    false    5         Y           0    0    COLUMN comments.comment_id    COMMENT     E   COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';
          public               root    false    217         �            1259    16409    comments_id_seq    SEQUENCE     �   ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    217    5         �            1259    16410 	   favorites    TABLE     y   CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.favorites;
       public         heap r       root    false    5         �            1259    16413    favorites_id_seq    SEQUENCE     �   ALTER TABLE public.favorites ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    219         �            1259    16414    notifications    TABLE     �   CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    id_user integer NOT NULL,
    date date NOT NULL,
    seen boolean DEFAULT false
);
 !   DROP TABLE public.notifications;
       public         heap r       root    false    5         �            1259    16420    notifications_id_seq    SEQUENCE     �   ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    221    5         �            1259    16421    threads    TABLE     �   CREATE TABLE public.threads (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_closed boolean NOT NULL,
    img_link text,
    user_id integer NOT NULL,
    date date NOT NULL,
    tags text NOT NULL
);
    DROP TABLE public.threads;
       public         heap r       root    false    5         �            1259    16426    threads_id_seq    SEQUENCE     �   ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    223         �            1259    16427    users    TABLE       CREATE TABLE public.users (
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
    DROP TABLE public.users;
       public         heap r       root    false    5         �            1259    16432    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    225         F          0    16398    benefits 
   TABLE DATA           R   COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
    public               root    false    215       3398.dat H          0    16404    comments 
   TABLE DATA           `   COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
    public               root    false    217       3400.dat J          0    16410 	   favorites 
   TABLE DATA           ;   COPY public.favorites (id, thread_id, user_id) FROM stdin;
    public               root    false    219       3402.dat L          0    16414    notifications 
   TABLE DATA           Z   COPY public.notifications (id, title, content, category, id_user, date, seen) FROM stdin;
    public               root    false    221       3404.dat N          0    16421    threads 
   TABLE DATA           _   COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags) FROM stdin;
    public               root    false    223       3406.dat P          0    16427    users 
   TABLE DATA           o   COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email, password) FROM stdin;
    public               root    false    225       3408.dat Z           0    0    benefits_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.benefits_id_seq', 1, false);
          public               root    false    216         [           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 1, false);
          public               root    false    218         \           0    0    favorites_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);
          public               root    false    220         ]           0    0    notifications_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);
          public               root    false    222         ^           0    0    threads_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.threads_id_seq', 8, true);
          public               root    false    224         _           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public               root    false    226         �           2606    16434    benefits benefits_name 
   CONSTRAINT     Q   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);
 @   ALTER TABLE ONLY public.benefits DROP CONSTRAINT benefits_name;
       public                 root    false    215         �           2606    16436    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 root    false    217         �           2606    16438    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 root    false    219         �           2606    16440     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 root    false    221         �           2606    16442    benefits pk_benefits 
   CONSTRAINT     R   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.benefits DROP CONSTRAINT pk_benefits;
       public                 root    false    215         �           2606    16444    threads thread_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);
 =   ALTER TABLE ONLY public.threads DROP CONSTRAINT thread_pkey;
       public                 root    false    223         �           2606    16446    users user_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.users DROP CONSTRAINT user_pkey;
       public                 root    false    225         �           2606    16447    threads FK_thread_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.threads DROP CONSTRAINT "FK_thread_user";
       public               root    false    223    3246    225         �           2606    16452    benefits fk_benefits_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.benefits DROP CONSTRAINT fk_benefits_user;
       public               root    false    3246    215    225         �           2606    16457    comments fk_comments_comment    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;
 F   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_comment;
       public               root    false    3238    217    217         �           2606    16462    comments fk_comments_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 E   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_thread;
       public               root    false    217    3244    223         �           2606    16467    comments fk_comments_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_user;
       public               root    false    217    3246    225         �           2606    16472    favorites fk_favorites_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 G   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_thread;
       public               root    false    219    3244    223         �           2606    16477    favorites fk_favorites_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 E   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_user;
       public               root    false    3246    219    225         �           2606    16482 "   notifications fk_notification_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;
 L   ALTER TABLE ONLY public.notifications DROP CONSTRAINT fk_notification_user;
       public               root    false    221    3246    225                    826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     K   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO root;
                        postgres    false                    826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     G   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO root;
                        postgres    false                    826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     K   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO root;
                        postgres    false                    826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     |   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO root;
                        postgres    false                                                                                                                                                                                                                 3398.dat                                                                                            0000600 0004000 0002000 00000000005 15007102334 0014246 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3400.dat                                                                                            0000600 0004000 0002000 00000000005 15007102334 0014226 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3402.dat                                                                                            0000600 0004000 0002000 00000000005 15007102335 0014231 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3404.dat                                                                                            0000600 0004000 0002000 00000000005 15007102335 0014233 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3406.dat                                                                                            0000600 0004000 0002000 00000000271 15007102335 0014242 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        8	thread 1	Este es el contenido	f	https://static01.nyt.com/images/2025/03/25/multimedia/17tb-iguanas-gwpk/17tb-iguanas-gwpk-superJumbo.jpg?quality=75&auto=webp	4	2024-01-01	iguana
\.


                                                                                                                                                                                                                                                                                                                                       3408.dat                                                                                            0000600 0004000 0002000 00000000177 15007102335 0014251 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        4	t	Jose antonio	jlopep09	100	https://catfriendly.com/wp-content/uploads/2025/02/h5n1-w3.jpg	87	jlopep09@gmail.com	123456
\.


                                                                                                                                                                                                                                                                                                                                                                                                 restore.sql                                                                                         0000600 0004000 0002000 00000027704 15007102335 0015372 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

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

DROP DATABASE fororatesdb;
--
-- Name: fororatesdb; Type: DATABASE; Schema: -; Owner: root
--

CREATE DATABASE fororatesdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';


ALTER DATABASE fororatesdb OWNER TO root;

\connect fororatesdb

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
-- Name: fororatesdb; Type: DATABASE PROPERTIES; Schema: -; Owner: root
--

ALTER DATABASE fororatesdb SET "TimeZone" TO 'utc';


\connect fororatesdb

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
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
-- Name: COLUMN comments.comment_id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';


--
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
-- Name: favorites; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.favorites OWNER TO root;

--
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
-- Data for Name: benefits; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
\.
COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM '$$PATH$$/3398.dat';

--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
\.
COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM '$$PATH$$/3400.dat';

--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.favorites (id, thread_id, user_id) FROM stdin;
\.
COPY public.favorites (id, thread_id, user_id) FROM '$$PATH$$/3402.dat';

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.notifications (id, title, content, category, id_user, date, seen) FROM stdin;
\.
COPY public.notifications (id, title, content, category, id_user, date, seen) FROM '$$PATH$$/3404.dat';

--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags) FROM stdin;
\.
COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags) FROM '$$PATH$$/3406.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email, password) FROM stdin;
\.
COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email, password) FROM '$$PATH$$/3408.dat';

--
-- Name: benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.benefits_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.threads_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: benefits benefits_name; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: benefits pk_benefits; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);


--
-- Name: threads thread_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);


--
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: threads FK_thread_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: benefits fk_benefits_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: comments fk_comments_comment; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;


--
-- Name: comments fk_comments_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: favorites fk_favorites_thread; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;


--
-- Name: favorites fk_favorites_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO root;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO root;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO root;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO root;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            