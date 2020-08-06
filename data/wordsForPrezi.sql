ALTER TABLE IF EXISTS ONLY public.words DROP CONSTRAINT IF EXISTS pk_word_id CASCADE;

DROP TABLE IF EXISTS public.words;
CREATE TABLE words (
    id serial NOT NULL,
    text text
);

ALTER TABLE ONLY words
    ADD CONSTRAINT pk_word_id PRIMARY KEY (id);

INSERT INTO public.words (id, text) VALUES (1, 'ATM');
INSERT INTO public.words (id, text) VALUES (2, 'CD');
INSERT INTO public.words (id, text) VALUES (3, 'SUV');
INSERT INTO public.words (id, text) VALUES (4, 'TV');
INSERT INTO public.words (id, text) VALUES (5, 'aardvark');
INSERT INTO public.words (id, text) VALUES (6, 'abacus');
INSERT INTO public.words (id, text) VALUES (7, 'abbey');
INSERT INTO public.words (id, text) VALUES (8, 'abbreviation');
INSERT INTO public.words (id, text) VALUES (9, 'abdomen');
INSERT INTO public.words (id, text) VALUES (10, 'ability');
INSERT INTO public.words (id, text) VALUES (11, 'abnormality');
INSERT INTO public.words (id, text) VALUES (12, 'abolishment');
INSERT INTO public.words (id, text) VALUES (13, 'abortion');
INSERT INTO public.words (id, text) VALUES (14, 'abrogation');
INSERT INTO public.words (id, text) VALUES (15, 'absence');
INSERT INTO public.words (id, text) VALUES (16, 'abundance');
INSERT INTO public.words (id, text) VALUES (17, 'abuse');
INSERT INTO public.words (id, text) VALUES (18, 'academics');
INSERT INTO public.words (id, text) VALUES (19, 'academy');
INSERT INTO public.words (id, text) VALUES (20, 'accelerant');
INSERT INTO public.words (id, text) VALUES (21, 'accelerator');
INSERT INTO public.words (id, text) VALUES (22, 'accent');
INSERT INTO public.words (id, text) VALUES (23, 'acceptance');
INSERT INTO public.words (id, text) VALUES (24, 'access');
INSERT INTO public.words (id, text) VALUES (25, 'accessory');
INSERT INTO public.words (id, text) VALUES (26, 'accident');
INSERT INTO public.words (id, text) VALUES (27, 'accommodation');
INSERT INTO public.words (id, text) VALUES (28, 'accompanist');
INSERT INTO public.words (id, text) VALUES (29, 'accomplishment');
INSERT INTO public.words (id, text) VALUES (30, 'accord');
INSERT INTO public.words (id, text) VALUES (31, 'accordance');
INSERT INTO public.words (id, text) VALUES (32, 'accordion');
INSERT INTO public.words (id, text) VALUES (33, 'account');
INSERT INTO public.words (id, text) VALUES (34, 'accountability');
INSERT INTO public.words (id, text) VALUES (35, 'accountant');
INSERT INTO public.words (id, text) VALUES (36, 'accounting');
INSERT INTO public.words (id, text) VALUES (37, 'accuracy');
INSERT INTO public.words (id, text) VALUES (38, 'accusation');
INSERT INTO public.words (id, text) VALUES (39, 'acetate');
INSERT INTO public.words (id, text) VALUES (40, 'achievement');
INSERT INTO public.words (id, text) VALUES (41, 'achiever');
INSERT INTO public.words (id, text) VALUES (42, 'acid');
INSERT INTO public.words (id, text) VALUES (43, 'acknowledgment');
INSERT INTO public.words (id, text) VALUES (44, 'acorn');
INSERT INTO public.words (id, text) VALUES (45, 'acoustics');
INSERT INTO public.words (id, text) VALUES (46, 'acquaintance');