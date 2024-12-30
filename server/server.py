from bottle import Bottle, run, request, response, auth_basic, HTTPResponse
import sqlite3
import secrets
import hashlib
import re
import json

conn : sqlite3.Connection = sqlite3.connect('dol.db')
app = Bottle()
MAX_SAVE_COUNT = 100

def main():
    sql_create_users = '''
    create table if not exists `users` (
      `id` integer not null primary key autoincrement,
      `username` varchar(255) not null,
      `password` varchar(255) not null,
      `salt` varchar(255) not null,
      `created_at` datetime not null default CURRENT_TIMESTAMP,
      `updated_at` datetime not null default CURRENT_TIMESTAMP
    )
    '''
    sql_create_saves = '''
    create table if not exists `saves` (
      `id` integer not null primary key autoincrement,
      `username` varchar(255) not null,
      `savename` varchar(255) not null,
      `data` BLOB not null,
      `created_at` datetime not null default CURRENT_TIMESTAMP,
      `updated_at` datetime not null default CURRENT_TIMESTAMP
    )
    '''
    conn.execute(sql_create_users)
    conn.execute(sql_create_saves)
    conn.commit()
    # run bottle
    #run(app=app, host='0.0.0.0', port=8089, server='gunicorn', keyfile='/etc/letsencrypt/live/ryanshy.eu/privkey.pem', certfile='/etc/letsencrypt/live/ryanshy.eu/fullchain.pem', accesslog='-')
    run(app=app, host='0.0.0.0', port=8088)
    conn.commit()
    conn.close()

def getUserId(username: str) -> int:
    sql_select_user = "select id, username from users where username = ?"
    cursor = conn.execute(sql_select_user, [username])
    for row in cursor:
        if row[1] == username:
            return int(row[0])
    return -1

def getSaveId(username: str, savename: str) -> int:
    sql_select_save = "select id, username, savename from saves where username = ? and savename = ?"
    cursor = conn.execute(sql_select_save, [username, savename])
    for row in cursor:
        if row[1] == username and row[2] == savename:
            return row[0]
    return -1

def getSave(username: str, savename: str) -> bytes:
    sql_select_save = "select id, username, savename, data from saves where username = ? and savename = ?"
    cursor = conn.execute(sql_select_save, [username, savename])
    for row in cursor:
        if row[1] == username and row[2] == savename:
            return row[3]
    return b''

def setSave(username: str, savename: str, data) -> None:
    if getSaveId(username, savename) < 0:
        # new save, insert
        sql_insert_save = "insert into saves(username, savename, data) values (?, ?, ?)"
        conn.execute(sql_insert_save, [username, savename, data])
    else:
        # overwrite save data
        sql_update_save = "update saves set data = ?, updated_at = CURRENT_TIMESTAMP where username = ? and savename = ?"
        conn.execute(sql_update_save, [data, username, savename])
    conn.commit()

def deleteSave(username: str, savename: str) -> None:
    sql_delete_save = "delete from saves where username = ? and savename = ?"
    conn.execute(sql_delete_save, [username, savename])
    conn.commit()

def getSaveCount(username: str) -> int:
    sql_select_saves = "select id from saves where username = ?"
    cursor = conn.execute(sql_select_saves, [username])
    results = cursor.fetchall()
    return len(results)

def getSaveList(username: str) -> list[dict]:
    sql_select_saves = "select id, savename, updated_at from saves where username = ?"
    cursor = conn.execute(sql_select_saves, [username])
    rv = []
    for row in cursor:
        rv.append({"savename": str(row[1]), "updated_at": row[2]})
    return rv

def is_authenticated_user(username, password) -> bool:
    sql_select_user = "select id, username, salt, password from users where username = ?"
    cursor = conn.execute(sql_select_user, [str(username)])
    for row in cursor:
        row_id = int(row[0])
        row_username = str(row[1])
        row_salt = str(row[2])
        row_password = str(row[3])
        if row_username == str(username):
            salted_password = row_salt + str(password)
            salted_hash = hashlib.sha512(salted_password.encode(), usedforsecurity=True)
            salted_hash_string = salted_hash.hexdigest()
            return row_password == salted_hash_string
    return False

def validateSaveName(savename: str) -> bool:
    x = re.search("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$", savename)
    if (x):
        return True
    return False

def create_base_user(username: str, pw: str) -> None:
    salt = secrets.token_urlsafe(16)
    salted_pw = salt + pw
    salted_hash = hashlib.sha512(salted_pw.encode(), usedforsecurity=True)
    salted_hash_string = salted_hash.hexdigest()
    sql_create_user = "insert into users(username, password, salt) values (?, ?, ?)"
    conn.execute(sql_create_user, [username, salted_hash_string, salt])
    conn.commit()

def update_user_password(username: str, pw: str) -> None:
    sql_select_user = "select id, salt from users where username = ?"
    cursor = conn.execute(sql_select_user, [str(username)])
    row = cursor.fetchone()
    salt = row[1]
    salted_pw = salt + pw
    salted_hash = hashlib.sha512(salted_pw.encode(), usedforsecurity=True)
    salted_hash_string = salted_hash.hexdigest()
    sql_update_user = "update users set password = ?, updated_at = CURRENT_TIMESTAMP where username = ? and id = ?"
    conn.execute(sql_update_user, [salted_hash_string, username, row[0]])
    conn.commit()

@app.route('/hello/<name>')
def hello(name: str):
    print(f"hello: {str(name)}")
    response.add_header("Access-Control-Allow-Origin", "*")
    return {"hello": str(name)}

@app.route('/dol/user/login', method='GET')
@auth_basic(is_authenticated_user)
def login():
    response.add_header("Access-Control-Allow-Origin", '*')
    return {"status": 200, "message": "ok"}

@app.route('/dol/save/<savename>', method='PUT')
@auth_basic(is_authenticated_user)
def save(savename: str):
    savename = str(savename)
    if not validateSaveName(savename):
        response.status = 404
        rv = {"status": 404, "message": "invalid save name"}
        return rv
    if request.content_length > int(1e6):
        response.status = 413
        rv = {"status": 413, "message": "file size too large!"}
        return rv
    username = request.auth[0]
    blob = request.body.read()
    if request.content_length != len(blob):
        # content length does not match, return error
        response.status = 400
        rv = {"status": 400, "message": "content-length header does not match data!"}
        return rv
    saveExists = getSaveId(username, savename) >= 0
    saveCount = getSaveCount(username)
    if not saveExists:
        saveCount += 1
    if saveCount > MAX_SAVE_COUNT:
        response.status = 405
        rv = {"status": 405, "message": "too many saves"}
        return rv
    setSave(username, savename, blob)
    return {"status": 200, "message": "ok"}

@app.route('/dol/save/<savename>', method='DELETE')
@auth_basic(is_authenticated_user)
def delete(savename):
    savename = str(savename)
    if not validateSaveName(savename):
        response.status = 404
        rv = {"status": 404, "message": "invalid save name"}
        return rv
    username = request.auth[0]
    saveId = getSaveId(username, savename)
    if saveId < 0:
        response.status = 404
        rv = {"status": 404, "message": "save not found"}
        return rv
    deleteSave(username, savename)
    return {"status": 200, "message": "ok"}

@app.route('/dol/save/<savename>', method='GET')
@auth_basic(is_authenticated_user)
def load(savename: str):
    savename = str(savename)
    if not validateSaveName(savename):
        response.status = 404
        rv = {"status": 404, "message": "invalid save name"}
        return rv
    username = request.auth[0]
    saveId = getSaveId(username, savename)
    if saveId < 0:
        response.status = 404
        rv = {"status": 404, "message": "save not found"}
        return rv
    blob = getSave(username, savename)
    return blob

@app.route('/dol/user/list', method='GET')
@auth_basic(is_authenticated_user)
def list():
    username = request.auth[0]
    saves = getSaveList(username)
    return {"status": 200, "message": "ok", "saves":saves}

@app.route('/dol/user/changepwd', method='PATCH')
@auth_basic(is_authenticated_user)
def changepwd():
    username = request.auth[0]
    requestBody = request.body.read()
    try:
        requestDict = json.loads(requestBody)
        new_pwd = requestDict['password']
        update_user_password(username, new_pwd)
    except ValueError:
        response.status = 400
        rv = {"status": 400, "message": "change password request malformed"}
        return rv
    return {"status": 200, "message": "ok"}

@app.error(401)
def error_handler_401(error):
    response.content_type = 'application/json'
    if "WWW-Authenticate" in response.headers:
        del response.headers["WWW-Authenticate"]
    response.body = {"status": 401, "message": "authentication failed"}
    return {"status": 401, "message": "authentication failed"}

@app.error(405)
def error_handler_405(res):
    if request.method == 'OPTIONS':
        rv = HTTPResponse()
        rv.set_header("Access-Control-Allow-Origin",'*')
        rv.set_header("Allow", res.headers['Allow'] + ', OPTIONS')
        rv.set_header("Access-Control-Allow-Methods", res.headers['Allow'] + ', OPTIONS')
        rv.set_header("Access-Control-Allow-Headers", 'Content-Type, Authorization')
        return rv
    res.headers['Allow'] += ', OPTIONS'
    return request.app.default_error_handler(res)

@app.hook('after_request')
def enableCORSHook():
    response.set_header("Access-Control-Allow-Origin",'*')

if __name__ == "__main__":
    main()