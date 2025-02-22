PGDMP                       }            chat_app    17.2    17.2 '    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            N           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            O           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            P           1262    16388    chat_app    DATABASE     �   CREATE DATABASE chat_app WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE chat_app;
                     postgres    false            _           1247    17225    enum_Files_status    TYPE     s   CREATE TYPE public."enum_Files_status" AS ENUM (
    'pending',
    'completed',
    'processing',
    'failed'
);
 &   DROP TYPE public."enum_Files_status";
       public               postgres    false            �            1259    16475    ActivityLogs    TABLE       CREATE TABLE public."ActivityLogs" (
    id integer NOT NULL,
    action character varying(255) NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 "   DROP TABLE public."ActivityLogs";
       public         heap r       postgres    false            �            1259    16474    ActivityLogs_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ActivityLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."ActivityLogs_id_seq";
       public               postgres    false    219            Q           0    0    ActivityLogs_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."ActivityLogs_id_seq" OWNED BY public."ActivityLogs".id;
          public               postgres    false    218            �            1259    17234    Files    TABLE     i  CREATE TABLE public."Files" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    format character varying(255) NOT NULL,
    status public."enum_Files_status" DEFAULT 'pending'::public."enum_Files_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);
    DROP TABLE public."Files";
       public         heap r       postgres    false    863    863            �            1259    17233    Files_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Files_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Files_id_seq";
       public               postgres    false    223            R           0    0    Files_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Files_id_seq" OWNED BY public."Files".id;
          public               postgres    false    222            �            1259    17244    Messages    TABLE       CREATE TABLE public."Messages" (
    id integer NOT NULL,
    content character varying(255) NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Messages";
       public         heap r       postgres    false            �            1259    17243    Messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Messages_id_seq";
       public               postgres    false    225            S           0    0    Messages_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;
          public               postgres    false    224            �            1259    16402    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap r       postgres    false            �            1259    17214    Users    TABLE     &  CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    17213    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public               postgres    false    221            T           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public               postgres    false    220            �           2604    16478    ActivityLogs id    DEFAULT     v   ALTER TABLE ONLY public."ActivityLogs" ALTER COLUMN id SET DEFAULT nextval('public."ActivityLogs_id_seq"'::regclass);
 @   ALTER TABLE public."ActivityLogs" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            �           2604    17237    Files id    DEFAULT     h   ALTER TABLE ONLY public."Files" ALTER COLUMN id SET DEFAULT nextval('public."Files_id_seq"'::regclass);
 9   ALTER TABLE public."Files" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222    223            �           2604    17247    Messages id    DEFAULT     n   ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);
 <   ALTER TABLE public."Messages" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    225    225            �           2604    17217    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            D          0    16475    ActivityLogs 
   TABLE DATA           X   COPY public."ActivityLogs" (id, action, "userId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   `-       H          0    17234    Files 
   TABLE DATA           _   COPY public."Files" (id, name, format, status, "createdAt", "updatedAt", "userId") FROM stdin;
    public               postgres    false    223   }-       J          0    17244    Messages 
   TABLE DATA           e   COPY public."Messages" (id, content, "senderId", "receiverId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    225   �-       B          0    16402    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public               postgres    false    217   h.       F          0    17214    Users 
   TABLE DATA           Z   COPY public."Users" (id, username, email, password, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   �.       U           0    0    ActivityLogs_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."ActivityLogs_id_seq"', 1, false);
          public               postgres    false    218            V           0    0    Files_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Files_id_seq"', 2, true);
          public               postgres    false    222            W           0    0    Messages_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Messages_id_seq"', 5, true);
          public               postgres    false    224            X           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 2, true);
          public               postgres    false    220            �           2606    16482    ActivityLogs ActivityLogs_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."ActivityLogs"
    ADD CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."ActivityLogs" DROP CONSTRAINT "ActivityLogs_pkey";
       public                 postgres    false    219            �           2606    17242    Files Files_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Files"
    ADD CONSTRAINT "Files_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Files" DROP CONSTRAINT "Files_pkey";
       public                 postgres    false    223            �           2606    17249    Messages Messages_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_pkey";
       public                 postgres    false    225            �           2606    16406     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public                 postgres    false    217            �           2606    17223    Users Users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
 C   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
       public                 postgres    false    221            �           2606    17221    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    221            �           2606    17255 !   Messages Messages_receiverId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."Users"(id) ON UPDATE CASCADE;
 O   ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_receiverId_fkey";
       public               postgres    false    221    225    4778            �           2606    17250    Messages Messages_senderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Users"(id) ON UPDATE CASCADE;
 M   ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_senderId_fkey";
       public               postgres    false    221    4778    225            D      x������ � �      H   O   x�3�t,.�L��M�+�K�O�����9�%�)�FF����F�
��V&�V&�z���V�Xe�La�\1z\\\ �f      J   |   x�}�;�@k��#,�,�Y�"�����lI��<��	l;((�O,��K�4M
.o�4~�����q6��KYH}��\)Z��G��V��Ɩ��լ�f�W�;ϕ����bj*�Τ6�t?��?Z�D�      B   +   x�3202504�0�426��M.JM,I�--N-��*����� ��	      F   �   x�}���@Fם���N��[��!H+��DlnQ�iC[��k��D��ۜ�9\�nT�tw
�]�J�u�tPe����[e�x�F�ǢP;ך��䙃���zY�.�)h�@4o�U�m������u&l����T���I��m���m����2�C?����n>�g��c����4/>��&�����NɊB���N     