PGDMP                      }           fororatesdb    16.8 (Debian 16.8-1.pgdg120+1)    17.2 .    Y           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            Z           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            [           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            \           1262    16389    fororatesdb    DATABASE     v   CREATE DATABASE fororatesdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE fororatesdb;
                     root    false            ]           0    0    fororatesdb    DATABASE PROPERTIES     4   ALTER DATABASE fororatesdb SET "TimeZone" TO 'utc';
                          root    false            �            1259    16398    benefits    TABLE     �   CREATE TABLE public.benefits (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.benefits;
       public         heap r       root    false            �            1259    16403    benefits_id_seq    SEQUENCE     �   ALTER TABLE public.benefits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.benefits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    216            �            1259    16404    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    likes integer,
    dislikes integer,
    content text NOT NULL,
    user_id integer NOT NULL,
    thread_id integer NOT NULL,
    comment_id integer
);
    DROP TABLE public.comments;
       public         heap r       root    false            ^           0    0    COLUMN comments.comment_id    COMMENT     E   COMMENT ON COLUMN public.comments.comment_id IS 'comentario previo';
          public               root    false    218            �            1259    16409    comments_id_seq    SEQUENCE     �   ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    218            �            1259    16410 	   favorites    TABLE     y   CREATE TABLE public.favorites (
    id integer NOT NULL,
    thread_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.favorites;
       public         heap r       root    false            �            1259    16413    favorites_id_seq    SEQUENCE     �   ALTER TABLE public.favorites ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    220            �            1259    16414    notifications    TABLE     �   CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    id_user integer NOT NULL,
    seen boolean DEFAULT false,
    id_thread integer
);
 !   DROP TABLE public.notifications;
       public         heap r       root    false            �            1259    16420    notifications_id_seq    SEQUENCE     �   ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    222            �            1259    16421    threads    TABLE     <  CREATE TABLE public.threads (
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
       public         heap r       root    false            �            1259    16426    threads_id_seq    SEQUENCE     �   ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    224            �            1259    16427    users    TABLE     �   CREATE TABLE public.users (
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
       public         heap r       root    false            �            1259    16432    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               root    false    226            K          0    16398    benefits 
   TABLE DATA           R   COPY public.benefits (id, name, price, start_date, end_date, user_id) FROM stdin;
    public               root    false    216   F6       M          0    16404    comments 
   TABLE DATA           `   COPY public.comments (id, likes, dislikes, content, user_id, thread_id, comment_id) FROM stdin;
    public               root    false    218   �6       O          0    16410 	   favorites 
   TABLE DATA           ;   COPY public.favorites (id, thread_id, user_id) FROM stdin;
    public               root    false    220   �6       Q          0    16414    notifications 
   TABLE DATA           U   COPY public.notifications (id, title, content, id_user, seen, id_thread) FROM stdin;
    public               root    false    222   �6       S          0    16421    threads 
   TABLE DATA           f   COPY public.threads (id, title, content, is_closed, img_link, user_id, date, tags, votes) FROM stdin;
    public               root    false    224   �6       U          0    16427    users 
   TABLE DATA           e   COPY public.users (id, is_admin, fullname, username, score, img_link, reputation, email) FROM stdin;
    public               root    false    226   SA       _           0    0    benefits_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.benefits_id_seq', 5, true);
          public               root    false    217            `           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 1, false);
          public               root    false    219            a           0    0    favorites_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.favorites_id_seq', 13, true);
          public               root    false    221            b           0    0    notifications_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);
          public               root    false    223            c           0    0    threads_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.threads_id_seq', 23, true);
          public               root    false    225            d           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 61, true);
          public               root    false    227            �           2606    16434    benefits benefits_name 
   CONSTRAINT     Q   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT benefits_name UNIQUE (name);
 @   ALTER TABLE ONLY public.benefits DROP CONSTRAINT benefits_name;
       public                 root    false    216            �           2606    16436    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 root    false    218            �           2606    16438    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 root    false    220            �           2606    16440     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 root    false    222            �           2606    16442    benefits pk_benefits 
   CONSTRAINT     R   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT pk_benefits PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.benefits DROP CONSTRAINT pk_benefits;
       public                 root    false    216            �           2606    16444    threads thread_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);
 =   ALTER TABLE ONLY public.threads DROP CONSTRAINT thread_pkey;
       public                 root    false    224            �           2606    16513    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public                 root    false    226            �           2606    16446    users user_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.users DROP CONSTRAINT user_pkey;
       public                 root    false    226            �           2606    16447    threads FK_thread_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.threads
    ADD CONSTRAINT "FK_thread_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.threads DROP CONSTRAINT "FK_thread_user";
       public               root    false    224    226    3251            �           2606    16452    benefits fk_benefits_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.benefits
    ADD CONSTRAINT fk_benefits_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.benefits DROP CONSTRAINT fk_benefits_user;
       public               root    false    226    3251    216            �           2606    16457    comments fk_comments_comment    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;
 F   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_comment;
       public               root    false    218    218    3241            �           2606    16462    comments fk_comments_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 E   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_thread;
       public               root    false    3247    224    218            �           2606    16467    comments fk_comments_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 C   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_comments_user;
       public               root    false    226    3251    218            �           2606    16472    favorites fk_favorites_thread    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id) NOT VALID;
 G   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_thread;
       public               root    false    220    224    3247            �           2606    16477    favorites fk_favorites_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 E   ALTER TABLE ONLY public.favorites DROP CONSTRAINT fk_favorites_user;
       public               root    false    220    226    3251            �           2606    16482 "   notifications fk_notification_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;
 L   ALTER TABLE ONLY public.notifications DROP CONSTRAINT fk_notification_user;
       public               root    false    3251    226    222            K   6   x�3�,.)��K�440�4202�50�56T04�25�25�3�4�)nh����� ��      M      x������ � �      O      x���42�44�24�4� 1b���� $�      Q      x������ � �      S   R
  x��X�nG]7��6����C������(i�z&@(vɢ���U]�c��Yx��f ��|ɜ[ݔ(�g3����U��s�=�(>	+V��,���h����x����I&r��2mYi�e��������5�Nd�eB�H���T&�\}SMV��u�\0^^�������b�����$�� xWg��R&�ݱ\"���M�M��m6rẅD�B�;e7�Of�o�l�%��P��Qj�'�HJ��A��a�o��V�e��N����߰m~'�Lb/�t�Q�E��B*�Ŭ�A��:q�S�3�t.؉F��H��s��-��� ���{�|����Wrɜ�~nq+EJև�J��%���u�,�ɸS*�fx��|�P�6;L��0��'P�yYv���۹H%o��k���󙰝Qgt��_���mqv;�?,G�Y4>	���Y���:�u1*ǧ�7��l1^���E�_^����~�9y�����w��aw|�{7���c��<�z7Z����(ë6>ú$�V<dQ�zPI��(� R�6��4���v#���d����XPж�(��-gG.�^�xjd�C����.��8O9��/j7wb�;F���m����DV�[���R*O�I�Ya��\�t�c�k���wݲ��ƞ����u�,�=�rf%[J+Kl�ڧgk>�5
Y�xx���������盛y� >��-�U�Y§���,aA���R��H��	㞽1���~?s���Hp��:�(W�!�'�]�����},}BNah�6;�Lo4���W��	�5ӆR<h �e���X�t=&u�L���D(��F4��c�|�lb�D��a�s^�?>eǙ�o��L�tsT�X����а�PR0��A*��[Ɇ�L��R�ubF��+0h����P�of���)��!7$�� ����׽� KG|�m6N�(y�u�d�8a�Eݚ8��M�&uI)���������F�EU�S57;+�
��i���t���@�Vf]�+��.UN�/�saʱ��I�$#��Ш����lO�����T�W�t�`Ѭm�i�� 
 ����
��pb�Ͼ�J�(�����1 cP+��|�5�T3�b	�l5�.��R������Чj����P�_�l���P%F�h"%�o�fs��ɜ�	�6Y�/%��K�b0��="�
5'Vu��g�-�)�E�"���'� pYe�G�dN�cS?���+��zS�T����EI�˹�ѿ�˃_��~��"=+�������$���S�넷�N��ۨ;;SY���Dq����t�\��N2���+n�(�R&:qo��moG����w�`���֓ȡ<[uy6�
կAj�{*D�Y�DV���̩��e��s�:ò�/���+Rb���Y��>&5��;�L�����}O�"��|�ިp����p3Co�����@=0q��=vЌ�B�6J!2��d]��M�B��y���1�� ��E���k�_�ۚc�=��
����;=G�s]��D's�P���x��Mt���iX ?E����V�!,�a.��n��g�HC��w����d0bz����ܩ�����L�憿\�4lN>�Q5CW_r���G<��C��M��=@��I��3��vh����%r��kc=�9�'�DK���ۑ!�!�9�}�ZC}����*�^y�m	� ���K��{���a�XU���k+q��x���si�OymC0�K�80��������nI�dK��%M�9O�y�#��݉
R�n8 �R���*,I�1�%(@f�̎VըSl����Pĥ$����ctv���T�K��ۣ�O���B|��\x���M4��W�K~ό��)�u�0x[ك����ֽ��
�W޴�Ǐޅ�o`XC/��ȑ�����l�*fo�n�9_�_O{��	�QOj˳%��%������)�q�U�/�ό���2��ܨ<|�6�\y�)���{����nE�0�F�A�?���h�C��a�d����+�=Rs3_�Ǹ�pLǞ& ��PZj��
��vٞN�H��H���ʝ�e+����Q���O��И�	�|��I�b#_�J	 ��$�'�]�'������xr�F�m��U���b=�E|&#�
<;���Q=q,��S���o5��I(�5Or�Y����Q���^z�+a�T�6G�PN&�<^��������r�����p��~$�o5F����Hd\I-�8����+��;�-:[���Q�zB��J���_lV;�a#����FZ��B���괁����O��~t���68��?�:���Ѧ�!!JwN� ��\ҁw�'�J����z~C	� �0Z:��^����gmG��K���&o�F^K*n�}+�[-�ke+��t��O��=�����]�2ϣҫ#�j��j���^��'��U<$��l�aq������Q�­����ݣ���"�X� �6�.��#�2Έr���1sv�=����E�Po�W�G�U�z�����Eg��Q����{�u+�l�k�1KDVSu6�2]0%���wT�	w���f����H}�9�:�o^tm�E��L�|�R�4�~&"�o7�� �p      U   �  x���ˎ�0���)Xu�8�*��m��iG��I��c���%�>J������!�����H�����7����ʹ�mPࠍ�R��8#<i� �S�DR,E�3B��{�Ǎ��,�:��Jv$�Z���$�J˹̀Đ����%����FP��mC�q�'K8H&2b4���g�S"��f�5��Q\��Z��z���ѾW����>�8�bP�O?َdP�81w����6���0(#�5p]�0��~��ع���r�E��cqߊ���3�o�"�v*{7[�e��Q���狤�ڡ����.(�ǔ��sNn����q�E�P���F�:��}Q��D��qm~��hJP�s� ;>63͙�)� �6�ʢIn�WV����o,�K�&y�e�~�Q}�4�w$ע���4;\
u��Pv�9t*u��N��Sݰ*}����㿩��b�&���:�٧'���ÓH����Թ�G�o���w�`i��_$^�}�k��yh1�     