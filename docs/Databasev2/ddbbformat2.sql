toc.dat                                                                                             0000600 0004000 0002000 00000033534 15016620355 0014452 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   3                    }           fororatesdb    16.8 (Debian 16.8-1.pgdg120+1)    17.2 0    _           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false         `           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false         a           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false         b           1262    16389    fororatesdb    DATABASE     v   CREATE DATABASE fororatesdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE fororatesdb;
                     root    false         c           0    0    fororatesdb    DATABASE PROPERTIES     4   ALTER DATABASE fororatesdb SET "TimeZone" TO 'utc';
                          root    false                     2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     root    false         d           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        root    false    6         �            1259    16398    benefits    TABLE     �   CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.benefits;
       public         heap r       root    false    6         �            1259    16403    benefits_id_seq    SEQUENCE     �   ALTER TABLE public.benefits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.benefits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    216    6         �            1259    16404    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    likes integer,
    dislikes integer,
    content text NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    comment_id integer
);
    DROP TABLE public.comments;
       public         heap r       root    false    6         e           0    0    COLUMN comments.comment_id    COMMENT     E   COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';
          public               root    false    218         �            1259    16409    comments_id_seq    SEQUENCE     �   ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    218    6         �            1259    16410 	   favorites    TABLE     y   CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.favorites;
       public         heap r       root    false    6         �            1259    16413    favorites_id_seq    SEQUENCE     �   ALTER TABLE public.favorites ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    220    6         �            1259    16414    notifications    TABLE     �   CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    id_user integer NOT NULL,
    seen boolean DEFAULT false,
    id_thread integer
);
 !   DROP TABLE public.notifications;
       public         heap r       root    false    6         �            1259    16420    notifications_id_seq    SEQUENCE     �   ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    6    222         �            1259    16421    threads    TABLE     <  CREATE TABLE public.threads (
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
    DROP TABLE public.threads;
       public         heap r       root    false    6         �            1259    16426    threads_id_seq    SEQUENCE     �   ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    6    224         �            1259    16427    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    is_admin boolean NOT NULL,
    fullname text NOT NULL,
    username text NOT NULL,
    score integer NOT NULL,
    img_link text,
    reputation integer NOT NULL,
    email text NOT NULL
);
    DROP TABLE public.users;
       public         heap r       root    false    6         �            1259    16432    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    226    6         Q          0    16398    benefits 
   TABLE DATA           R   COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
    public               root    false    216       3409.dat S          0    16404    comments 
   TABLE DATA           `   COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
    public               root    false    218       3411.dat U          0    16410 	   favorites 
   TABLE DATA           ;   COPY public.favorites (id, thread_id, user_id) FROM stdin;
    public               root    false    220       3413.dat W          0    16414    notifications 
   TABLE DATA           U   COPY public.notifications (id, title, content, id_user, seen, id_thread) FROM stdin;
    public               root    false    222       3415.dat Y          0    16421    threads 
   TABLE DATA           f   COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags, votes) FROM stdin;
    public               root    false    224       3417.dat [          0    16427    users 
   TABLE DATA           e   COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email) FROM stdin;
    public               root    false    226       3419.dat f           0    0    benefits_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.benefits_id_seq', 5, true);
          public               root    false    217         g           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 1, false);
          public               root    false    219         h           0    0    favorites_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.favorites_id_seq', 13, true);
          public               root    false    221         i           0    0    notifications_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);
          public               root    false    223         j           0    0    threads_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.threads_id_seq', 23, true);
          public               root    false    225         k           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 61, true);
          public               root    false    227         �           2606    16434    benefits benefits_name 
   CONSTRAINT     Q   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);
 @   ALTER TABLE ONLY public.benefits DROP CONSTRAINT benefits_name;
       public                 root    false    216         �           2606    16436    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 root    false    218         �           2606    16438    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 root    false    220         �           2606    16440     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 root    false    222         �           2606    16442    benefits pk_benefits 
   CONSTRAINT     R   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.benefits DROP CONSTRAINT pk_benefits;
       public                 root    false    216         �           2606    16444    threads thread_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);
 =   ALTER TABLE ONLY public.threads DROP CONSTRAINT thread_pkey;
       public                 root    false    224         �           2606    16513    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public                 root    false    226         �           2606    16446    users user_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.users DROP CONSTRAINT user_pkey;
       public                 root    false    226         �           2606    16447    threads FK_thread_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.threads DROP CONSTRAINT "FK_thread_user";
       public               root    false    224    226    3257         �           2606    16452    benefits fk_benefits_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.benefits DROP CONSTRAINT fk_benefits_user;
       public               root    false    226    3257    216         �           2606    16457    comments fk_comments_comment    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;
 F   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_comment;
       public               root    false    218    218    3247         �           2606    16462    comments fk_comments_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 E   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_thread;
       public               root    false    3253    224    218         �           2606    16467    comments fk_comments_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_user;
       public               root    false    226    3257    218         �           2606    16472    favorites fk_favorites_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 G   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_thread;
       public               root    false    220    224    3253         �           2606    16477    favorites fk_favorites_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 E   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_user;
       public               root    false    220    226    3257         �           2606    16482 "   notifications fk_notification_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;
 L   ALTER TABLE ONLY public.notifications DROP CONSTRAINT fk_notification_user;
       public               root    false    3257    226    222                                                                                                                                                                            3409.dat                                                                                            0000600 0004000 0002000 00000000105 15016620355 0014250 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        5	string	100	2025-05-31 14:55:50.294	2025-05-31 14:55:50.294	12
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                           3411.dat                                                                                            0000600 0004000 0002000 00000000005 15016620355 0014240 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3413.dat                                                                                            0000600 0004000 0002000 00000000026 15016620355 0014245 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        9	20	11
11	18	11
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          3415.dat                                                                                            0000600 0004000 0002000 00000000005 15016620355 0014244 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3417.dat                                                                                            0000600 0004000 0002000 00000011375 15016620355 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        10	Reseña del libro “El problema de los tres cuerpos”	No suelo leer ciencia ficción, pero este libro me atrapó. La forma en que mezcla ciencia, política y misterio es fascinante. Muy recomendable para quienes les gusta el pensamiento abstracto.	f		8	2025-04-03 18:45:00	libros, ciencia ficción, literatura	14
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


                                                                                                                                                                                                                                                                   3419.dat                                                                                            0000600 0004000 0002000 00000001600 15016620355 0014252 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        7	f	Lucia	lucia_tech	50	https://randomuser.me/api/portraits/women/44.jpg	10	lucia@example.com
8	f	Marco	marco_reader	70	https://randomuser.me/api/portraits/men/33.jpg	45	marco@example.com
9	f	Ana	ana_explora	100	https://randomuser.me/api/portraits/women/66.jpg	0	ana@example.com
10	f	David	david_foodie	0	https://randomuser.me/api/portraits/men/21.jpg	32	david@example.com
11	f	David González Álvarez	dgonza11	0	https://lh3.googleusercontent.com/a/ACg8ocI0SMAkpDrcIdPzS8czNy0M3BKoc-vs6I2BktklEOH5TxCnOg=s96-c	0	dgonza11@estudiantes.unileon.es
12	f	Jositos Lopez	jositoslopez	900	https://static01.nyt.com/images/2025/03/25/multimedia/17tb-iguanas-gwpk/17tb-iguanas-gwpk-superJumbo.jpg?quality=75&auto=webp	0	jositoslopez@gmail.com
60	f	Jose López perez	jose.lppz03	0	https://lh3.googleusercontent.com/a/ACg8ocKOL5i7e6HHnXJeLQZ3zGoDUZ3xgCDUGK0EJyWHGYWIRNb5_-s=s96-c	0	jose.lppz03@gmail.com
\.


                                                                                                                                restore.sql                                                                                         0000600 0004000 0002000 00000027051 15016620355 0015374 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO root;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: root
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
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
    id_user integer NOT NULL,
    seen boolean DEFAULT false,
    id_thread integer
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
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tags text NOT NULL,
    votes integer DEFAULT 0
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
    email text NOT NULL
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
COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM '$$PATH$$/3409.dat';

--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
\.
COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM '$$PATH$$/3411.dat';

--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.favorites (id, thread_id, user_id) FROM stdin;
\.
COPY public.favorites (id, thread_id, user_id) FROM '$$PATH$$/3413.dat';

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.notifications (id, title, content, id_user, seen, id_thread) FROM stdin;
\.
COPY public.notifications (id, title, content, id_user, seen, id_thread) FROM '$$PATH$$/3415.dat';

--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags, votes) FROM stdin;
\.
COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags, votes) FROM '$$PATH$$/3417.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email) FROM stdin;
\.
COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email) FROM '$$PATH$$/3419.dat';

--
-- Name: benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.benefits_id_seq', 5, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.favorites_id_seq', 13, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);


--
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.threads_id_seq', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 61, true);


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
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


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
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       