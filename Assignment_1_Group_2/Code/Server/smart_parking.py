from database import DatabaseManager
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity

app = Flask('Smart-Parking-System')
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

CORS(app)
db = DatabaseManager()

@app.post('/signup')
def signup():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']
        email = data['email']
        phone = data['phone']
        success,message = db.create_user(username=username,password=password,email=email,phone=phone)
        if success:
            return jsonify({"message":"User Created Successfully."}),200
        else:
            return jsonify({"message":message}),400
    
    except Exception as e:
        return jsonify({"message":e}),500
    
@app.post('/signin')
def signin():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']
        user_found = db.get_user(username)
        if(user_found):
            if(user_found.password != password):
                return jsonify({"message":"invalid password"}), 401

            access_token = create_access_token(identity=username)
            return jsonify({ "token": access_token}),200
               
        else:
            return jsonify({"message":"username not found"}),401
        
    except Exception as e:
        return jsonify({"message": e}), 500

@app.get('/lotsInfo')
def lotsInfo():
    try:
        info = db.get_lots_info()
        return jsonify({"info":info}),200
    except Exception as e:
        return jsonify({"Error",e}), 500

@app.get('/userInfo')
@jwt_required()
def userInfo():
    try:
        current_username = get_jwt_identity()
        user_found = db.get_user(current_username)
        bookings_found = db.get_bookings(user_found.user_id)
        return jsonify({"user":user_found,"bookings":bookings_found})
    except Exception as e:
        return jsonify({"message":e}), 500

@app.get('/lotBook')
@jwt_required()
def lotBook():
    try:
        data = request.get_json()
        lot_id = data['lot_id']
        current_username = get_jwt_identity()
        user_found = db.get_user(current_username)
        res = db.book_lot(user_found.user_id,lot_id)
        if(res):
            return jsonify({"message":"Parking Lot booked Successfully."}), 200
        else:
            return jsonify({"message":"Failed to book parking lot."}), 401
    
    except Exception as e:
        return jsonify({"message":e}), 500 

@app.get('/lotRelease')
@jwt_required()
def lotRelease():
    try:
        data = request.get_json()
        lot_id = data['lot_id']
        current_username = get_jwt_identity()
        user_found = db.get_user(current_username)
        res,cost = db.release_lot(lot_id=lot_id,user_id=user_found.user_id)
        if(res):
            return jsonify({"message":cost}), 200
        else:
            return jsonify({"message":"Failed to release the Parking lot."}), 401

    except Exception as e:
        return jsonify({"message":e}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11172)