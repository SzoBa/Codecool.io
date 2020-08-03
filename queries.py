import bcrypt
import connection


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
def insert_new_player(cursor, player_name, room_id):
    query = '''
        INSERT INTO player
        (name, room_id, is_drawer)
        VALUES (%(username)s, %(room_id)s, TRUE)
        '''
    cursor.execute(query, {'username': player_name, 'room_id': room_id})
