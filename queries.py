import bcrypt
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
def insert_new_player(cursor, player_name, room_id, is_drawer=False):
    drawer_boolean = 'TRUE' if is_drawer else 'FALSE'
    query = '''
        INSERT INTO player
        (id, name, room_id, is_drawer)
        VALUES (DEFAULT, {username}, {room_id}, {drawer_boolean})
        RETURNING id
        '''
    cursor.execute(sql.SQL(query).format(username=sql.Literal(player_name),
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
            '''
    cursor.execute(query, {'player_id': player_id})
