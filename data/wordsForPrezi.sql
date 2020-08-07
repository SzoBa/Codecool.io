ALTER TABLE IF EXISTS ONLY public.words DROP CONSTRAINT IF EXISTS pk_word_id CASCADE;

DROP TABLE IF EXISTS public.words;
CREATE TABLE words (
    id serial NOT NULL,
    text text
);

ALTER TABLE ONLY words
    ADD CONSTRAINT pk_word_id PRIMARY KEY (id);

INSERT INTO public.words (id, text) VALUES (1, 'PA');
INSERT INTO public.words (id, text) VALUES (2, 'Python');
INSERT INTO public.words (id, text) VALUES (3, 'WEB');
INSERT INTO public.words (id, text) VALUES (4, 'JavaScript');
INSERT INTO public.words (id, text) VALUES (5, 'Gábor');
INSERT INTO public.words (id, text) VALUES (6, 'Laci');
INSERT INTO public.words (id, text) VALUES (7, 'Réka');
INSERT INTO public.words (id, text) VALUES (8, 'Ági');
INSERT INTO public.words (id, text) VALUES (9, 'Miki');
INSERT INTO public.words (id, text) VALUES (10, 'HTTPS');
INSERT INTO public.words (id, text) VALUES (11, 'SQL');
INSERT INTO public.words (id, text) VALUES (12, 'debug');
INSERT INTO public.words (id, text) VALUES (13, 'function');
INSERT INTO public.words (id, text) VALUES (14, 'attendance');
INSERT INTO public.words (id, text) VALUES (15, 'Codecool');
INSERT INTO public.words (id, text) VALUES (16, 'localStorage');
INSERT INTO public.words (id, text) VALUES (17, 'WebSocket');
INSERT INTO public.words (id, text) VALUES (18, 'Ádám');
INSERT INTO public.words (id, text) VALUES (19, 'Bence');
INSERT INTO public.words (id, text) VALUES (20, 'request');
INSERT INTO public.words (id, text) VALUES (21, 'server');
INSERT INTO public.words (id, text) VALUES (22, 'accept');
INSERT INTO public.words (id, text) VALUES (23, 'JSON');
INSERT INTO public.words (id, text) VALUES (24, 'SCRUM');
INSERT INTO public.words (id, text) VALUES (25, 'reset');