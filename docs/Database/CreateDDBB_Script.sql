PGDMP  3    ,                }        	   fororates    16.8 (Debian 16.8-1.pgdg120+1)    17.2 2    T           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            V           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            W           1262    16389 	   fororates    DATABASE     t   CREATE DATABASE fororates WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE fororates;
                     root    false            X           0    0 	   fororates    DATABASE PROPERTIES     2   ALTER DATABASE fororates SET "TimeZone" TO 'utc';
                          root    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     root    false            �            1259    16411    benefits    TABLE     �   CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.benefits;
       public         heap r       root    false    5            �            1259    16469    benefits_id_seq    SEQUENCE     �   ALTER TABLE public.benefits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.benefits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    219    5            �            1259    16405    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    likes integer,
    dislikes integer,
    content text NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    comment_id integer
);
    DROP TABLE public.comments;
       public         heap r       root    false    5            Y           0    0    COLUMN comments.comment_id    COMMENT     E   COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';
          public               root    false    217            �            1259    16429    comments_id_seq    SEQUENCE     �   ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    217            �            1259    16449 	   favorites    TABLE     y   CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.favorites;
       public         heap r       root    false    5            �            1259    16477    favorites_id_seq    SEQUENCE     �   ALTER TABLE public.favorites ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    221    5            �            1259    16408    notifications    TABLE     �   CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    id_user integer NOT NULL,
    date date NOT NULL,
    seen boolean DEFAULT false
);
 !   DROP TABLE public.notifications;
       public         heap r       root    false    5            �            1259    16478    notifications_id_seq    SEQUENCE     �   ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    218    5            �            1259    16402    threads    TABLE     �   CREATE TABLE public.threads (
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
       public         heap r       root    false    5            �            1259    16479    threads_id_seq    SEQUENCE     �   ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    216            �            1259    16399    users    TABLE       CREATE TABLE public.users (
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
       public         heap r       root    false    5            �            1259    16480    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    5    215            J          0    16411    benefits 
   TABLE DATA           R   COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
    public               root    false    219   �9       H          0    16405    comments 
   TABLE DATA           `   COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
    public               root    false    217   �9       L          0    16449 	   favorites 
   TABLE DATA           ;   COPY public.favorites (id, thread_id, user_id) FROM stdin;
    public               root    false    221   �9       I          0    16408    notifications 
   TABLE DATA           Z   COPY public.notifications (id, title, content, category, id_user, date, seen) FROM stdin;
    public               root    false    218   :       G          0    16402    threads 
   TABLE DATA           _   COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags) FROM stdin;
    public               root    false    216   7:       F          0    16399    users 
   TABLE DATA           o   COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email, password) FROM stdin;
    public               root    false    215   �:       Z           0    0    benefits_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.benefits_id_seq', 1, false);
          public               root    false    222            [           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 1, false);
          public               root    false    220            \           0    0    favorites_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);
          public               root    false    223            ]           0    0    notifications_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);
          public               root    false    224            ^           0    0    threads_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.threads_id_seq', 6, true);
          public               root    false    225            _           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               root    false    226            �           2606    16500    benefits benefits_name 
   CONSTRAINT     Q   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);
 @   ALTER TABLE ONLY public.benefits DROP CONSTRAINT benefits_name;
       public                 root    false    219            �           2606    16428    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 root    false    217            �           2606    16533    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 root    false    221            �           2606    16573     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 root    false    218            �           2606    16498    benefits pk_benefits 
   CONSTRAINT     R   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.benefits DROP CONSTRAINT pk_benefits;
       public                 root    false    219            �           2606    16419    threads thread_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);
 =   ALTER TABLE ONLY public.threads DROP CONSTRAINT thread_pkey;
       public                 root    false    216            �           2606    16459    users user_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.users DROP CONSTRAINT user_pkey;
       public                 root    false    215            �           2606    16460    threads FK_thread_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.threads DROP CONSTRAINT "FK_thread_user";
       public               root    false    3234    215    216            �           2606    16501    benefits fk_benefits_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.benefits DROP CONSTRAINT fk_benefits_user;
       public               root    false    3234    215    219            �           2606    16527    comments fk_comments_comment    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;
 F   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_comment;
       public               root    false    217    217    3238            �           2606    16522    comments fk_comments_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 E   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_thread;
       public               root    false    3236    216    217            �           2606    16517    comments fk_comments_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_user;
       public               root    false    3234    217    215            �           2606    16539    favorites fk_favorites_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 G   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_thread;
       public               root    false    3236    216    221            �           2606    16534    favorites fk_favorites_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 E   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_user;
       public               root    false    215    3234    221            �           2606    16574 "   notifications fk_notification_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;
 L   ALTER TABLE ONLY public.notifications DROP CONSTRAINT fk_notification_user;
       public               root    false    218    215    3234                       826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     K   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO root;
                        postgres    false                       826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     G   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO root;
                        postgres    false                       826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     K   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO root;
                        postgres    false                       826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     |   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO root;
                        postgres    false            J      x������ � �      H      x������ � �      L      x������ � �      I      x������ � �      G   �   x���K�  �5���(�����nFA��@Bz����j�{��@�ǥQ%����Fm#����s�*����"v:����O�*p����/S4[:a���V`��a=]���qog!;� ���Ys���D�{��9�/EX#�Je�U:�*�p�ҩUiV1[�֫�/`�U髣�� �X\      F   �   x�=���0 �s���*(��D�!F�(�X�
����l��8�..��@���3�
���r��I�	Ң[	�p�ƨP�˙e��mR Z��$"�Sf���������ل�m�Q��;��:i6�h�rB�}���s�=<�S�ȍ
�����L9�h�D&I�ɴ��i���@�     