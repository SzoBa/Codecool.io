ALTER TABLE IF EXISTS ONLY public.player DROP CONSTRAINT IF EXISTS pk_player_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.room DROP CONSTRAINT IF EXISTS pk_room_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.player DROP CONSTRAINT IF EXISTS fk_room_id CASCADE;

DROP TABLE IF EXISTS public.player;
CREATE TABLE player (
    id serial NOT NULL,
    name text,
    password text,
    room_id integer,
    points integer DEFAULT 0,
    is_drawer boolean NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS public.room;
CREATE TABLE room (
    id serial NOT NULL,
    word text,
    max_round integer DEFAULT 3,
    round_counter integer DEFAULT 0,
    drawing_time integer DEFAULT 60,
    owner_id integer,
    is_open boolean NOT NULL DEFAULT true
);

ALTER TABLE ONLY player
    ADD CONSTRAINT pk_player_id PRIMARY KEY (id);

ALTER TABLE ONLY room
    ADD CONSTRAINT pk_room_id PRIMARY KEY (id);

ALTER TABLE ONLY player
    ADD CONSTRAINT fk_room_id FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE;
