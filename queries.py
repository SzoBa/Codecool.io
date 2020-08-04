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
def get_rooms(cursor):
    query = '''
    SELECT STRING_AGG(player.id::text, ',')   AS player_id,
        player.room_id,
       STRING_AGG(player.name, ',') AS player_name,
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