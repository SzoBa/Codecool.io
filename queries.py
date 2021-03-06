import bcrypt
from psycopg2._psycopg import cursor

import connection
from psycopg2 import sql


@connection.connection_handler
def get_existing_room(cursor):
    query = '''
            SELECT
                room.id AS room_id,
                player.name AS player_name,
                player.id AS player_id
            FROM room
            JOIN player
                ON room.id = player.room_id
            ORDER BY player.id ASC
        '''
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def insert_new_room(cursor):
    query = '''
        INSERT INTO room
        (id)
        VALUES (DEFAULT)
        RETURNING id
    '''
    cursor.execute(query)
    return cursor.fetchone()['id']


@connection.connection_handler
def insert_new_player(cursor, player_name, room_id, avatar, is_drawer=False):
    drawer_boolean = 'TRUE' if is_drawer else 'FALSE'
    query = '''
        INSERT INTO player
        (id, name, avatar, room_id, is_drawer)
        VALUES (DEFAULT, {username}, {avatar}, {room_id}, {drawer_boolean})
        RETURNING id
        '''
    cursor.execute(sql.SQL(query).format(username=sql.Literal(player_name),
                                         avatar=sql.Literal(avatar),
                                         room_id=sql.Literal(room_id),
                                         drawer_boolean=sql.SQL(drawer_boolean)))
    return cursor.fetchone()['id']


@connection.connection_handler
def close_room(cursor, room_id):
    query = '''
            UPDATE room
            SET is_open = FALSE
            WHERE id = %(room_id)s
            '''
    cursor.execute(query, {'room_id': room_id})


@connection.connection_handler
def get_solution(cursor, room_id):
    query = '''
            SELECT word
            FROM room
            WHERE id = %(room_id)s
            '''

    cursor.execute(query, {'room_id': room_id})
    return cursor.fetchone()['word']


@connection.connection_handler
def get_word(cursor, word_id, room_id):
    query = '''
            SELECT text
            FROM words
            WHERE id = %(word_id)s
            '''

    cursor.execute(query, {'word_id': word_id})
    word = cursor.fetchone()['text']
    insert_word(room_id, word)
    return word


@connection.connection_handler
def insert_word(cursor, room_id, word):
    query = '''
            UPDATE room
            SET word = %(word)s
            WHERE id = %(room_id)s
            '''

    cursor.execute(query, {'room_id': room_id, 'word': word})


@connection.connection_handler
def update_points(cursor, player_id):
    query = '''
            UPDATE player
            SET points = points + 1
            WHERE id = %(player_id)s
            RETURNING player.points
            '''
    cursor.execute(query, {'player_id': player_id})
    return cursor.fetchone()['points']


@connection.connection_handler
def get_players_data(cursor, room_id):
    query = """
    SELECT name, points, is_drawer, word, max_round, round_counter, drawing_time, player.id AS player_id, avatar 
    FROM player
    JOIN room ON player.room_id = room.id
    WHERE room.id = %(room_id)s
    """
    cursor.execute(query, {"room_id": room_id})
    return cursor.fetchall()


@connection.connection_handler
def update_drawer(cursor, new_drawer_id):
    query_old_drawer = """
            UPDATE player
            SET is_drawer = false 
            WHERE is_drawer = true
            """
    cursor.execute(query_old_drawer)
    query_new_drawer = """
                        UPDATE player
                        SET is_drawer = true 
                        WHERE id = %(new_drawer_id)s
                    """
    cursor.execute(query_new_drawer, {"new_drawer_id" : new_drawer_id})


@connection.connection_handler
def get_drawer(cursor):
    query = """
    SELECT id, name
    FROM player
    WHERE is_drawer = true
    """
    cursor.execute(query)
    return cursor.fetchone()
    
@connection.connection_handler
def get_rooms(cursor):
    query = '''
    SELECT STRING_AGG(player.id::text, ',') AS player_id,
        player.room_id,
       STRING_AGG(player.name, ',') AS player_name,
       STRING_AGG(player.avatar, ',') AS player_avatar,
       room.is_open,
       room.owner_id
    FROM player
        JOIN room ON player.room_id = room.id
    GROUP BY player.room_id, room.is_open, room.owner_id;
    '''
    cursor.execute(query)
    return cursor.fetchall()

@connection.connection_handler
def insert_owner_id_to_room(cursor, player_id, room_id):
    query = '''
            UPDATE room
            SET owner_id = %(player_id)s
            WHERE id = %(room_id)s
            '''
    cursor.execute(query, {'room_id': room_id, 'player_id': player_id})


@connection.connection_handler
def refresh_image(cursor, user_id, image):
    query = '''
            UPDATE player
            SET avatar = %(image)s
            WHERE id = %(user_id)s
            '''
    cursor.execute(query, {'user_id': user_id, 'image': image})


@connection.connection_handler
def get_avatar(cursor, user_id):
    query = '''
    SELECT avatar
    FROM player
    WHERE id = %(user_id)s;
    '''
    cursor.execute(query, {'user_id': user_id})
    return cursor.fetchone()


@connection.connection_handler
def get_username(cursor, user_id):
    query = '''
    SELECT name
    FROM player
    WHERE id = %(user_id)s;
    '''
    cursor.execute(query, {'user_id': user_id})
    return cursor.fetchone()


@connection.connection_handler
def get_name_by_id(cursor, owner_id):
    query = """
        SELECT name
        FROM player
        WHERE id = %(owner_id)s
        """
    cursor.execute(query, {'owner_id': owner_id})
    return cursor.fetchone()['name']

@connection.connection_handler
def set_room_params(cursor, room_data):
    room_id = room_data['room_id']
    round_number = room_data['round_number']
    round_timer = room_data['round_timer']

    query = '''
            UPDATE room
            SET  max_round = %(round_number)s, drawing_time = %(round_timer)s 
            WHERE id = %(room_id)s
            '''
    cursor.execute(query, {'room_id': room_id,
                           'round_number': round_number,
                           'round_timer': round_timer})
