import bcrypt
import connection


@connection.connection_handler
def insert_new_room(cursor):
    query = '''
        INSERT INTO room
        RETURNING id
    '''
    cursor.execute(query)
    return cursor.fetchone()['id']


@connection.connection_handler
def insert_new_player(cursor, player_name, room_id):
    query = '''
        INSERT INTO player
        (%(username)s, %(room_id)s)
        '''
    cursor.execute(query, {'username': player_name, 'room_id': room_id})
