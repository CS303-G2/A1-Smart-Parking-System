from datetime import datetime
import sqlite3
from .types import User

COST_PER_HOUR = {
    1: 10,
    2: 8,
    3: 6,
}
N_FLOORS = 3
N_ROWS = 10
N_COLS = 10

class DatabaseManager:
    def __init__(self):
        self.db = sqlite3.connect('database.db')
        self.cursor = self.db.cursor()
        self.__initialize_tables()

    def __initialize_tables(self):
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   username TEXT UNIQUE NOT NULL,
                   password TEXT NOT NULL,
                   email TEXT UNIQUE NOT NULL,
                   phone TEXT UNIQUE NOT NULL,
                   usage_bill REAL DEFAULT 0
                )
        ''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS parking_lots (
                id TEXT PRIMARY KEY,
                booked BOOLEAN NOT NULL DEFAULT FALSE,
                user_id INTEGER,
                booked_at DATETIME,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        self.db.commit()
        self.cursor.execute('''SELECT COUNT(*) FROM parking_lots''')
        count = self.cursor.fetchone()[0]
        if count == 0:
            for floor in range(1, N_FLOORS+1):
                for row in range(1, N_ROWS+1):
                    for col in range(1, N_COLS+1):
                        lot_id = f"{floor}_{row}_{col}"
                        self.cursor.execute(
                            '''INSERT INTO parking_lots (id) VALUES (?)''', (lot_id,)
                        )
            self.db.commit()

    def close(self):
        self.db.close()
        
    def create_user(self, username, password, email, phone):
        try:
            self.cursor.execute(
                '''INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)''',
                (username, password, email, phone)
            )
            self.db.commit()
            return True, "User created successfully."

        except sqlite3.IntegrityError as e:
            error_message = str(e)
            if "UNIQUE constraint failed: users.username" in error_message:
                return False, "Username already exists."
            elif "UNIQUE constraint failed: users.email" in error_message:
                return False, "Email already exists."
            elif "UNIQUE constraint failed: users.phone" in error_message:
                return False, "Phone number already exists."
            elif "NOT NULL constraint failed: users.username" in error_message:
                return False, "Username cannot be null."
            elif "NOT NULL constraint failed: users.password" in error_message:
                return False, "Password cannot be null."
            elif "NOT NULL constraint failed: users.email" in error_message:
                return False, "Email cannot be null."
            elif "NOT NULL constraint failed: users.phone" in error_message:
                return False, "Phone number cannot be null."
            else:
                return False, "An error occurred."



    def get_user(self, username):
        self.cursor.execute('''SELECT * FROM users WHERE username = ?''', (username,))
        user = self.cursor.fetchone()
        if user is None:
            return None
        return User(*user)

    def get_all_users(self):
        self.cursor.execute('''SELECT * FROM users''')
        return self.cursor.fetchall()

    def delete_user(self, username):
        cursor = self.cursor.execute('''DELETE FROM users WHERE username = ?''', (username,))
        if cursor.rowcount == 0:
            return False
        self.db.commit()
        return True

    def update_user(self, username, password = None, email = None, phone = None):
        if username is None:
            return False
        user = self.get_user(username)
        if user is None:
            return False
        if password is None:
            password = user[2]
        if email is None:
            email = user[3]
        if phone is None:
            phone = user[4]
        cursor = self.cursor.execute('''UPDATE users SET password = ?, email = ?, phone = ? WHERE username = ?''', (password, email, phone, username))
        if cursor.rowcount == 0:
            return False
        self.db.commit()
        return True
    
    def get_lots_info(self):
        self.cursor.execute('''SELECT id, booked FROM parking_lots''')
        return self.cursor.fetchall()
    
    def get_bookings(self, user_id):
        self.cursor.execute('''SELECT id, booked_at FROM parking_lots WHERE user_id = ?''', (user_id,))
        return self.cursor.fetchall()
    
    def get_booking(self, user_id, lot_id):
        self.cursor.execute('''SELECT booked_at FROM parking_lots WHERE user_id = ? AND id = ?''', (user_id, lot_id))
        booking = self.cursor.fetchone()
        if booking is None:
            return None
        return booking
    
    def book_lot(self, user_id, lot_id):
        try:
            self.cursor.execute('''SELECT booked FROM parking_lots WHERE id = ?''', (lot_id,))
            lot = self.cursor.fetchone()
            if lot is None:
                return False, "Lot not found."
            if lot[0]:
                return False, "Lot already booked."
            self.cursor.execute('''UPDATE parking_lots SET booked = TRUE, user_id = ?, booked_at = ? WHERE id = ?''', (user_id, datetime.now(), lot_id))
            self.db.commit()
            return True, "Lot booked successfully."
        except Exception as e:
            self.db.rollback()
            return False, f"Error: {e}"
    

    def release_lot(self, lot_id, user_id):
        try:
            self.cursor.execute(
                '''SELECT booked, booked_at, user_id FROM parking_lots WHERE id = ?''', (lot_id,)
            )
            lot = self.cursor.fetchone()

            if lot is None:
                return False, "Lot not found."
            
            booked, booked_at, current_user_id = lot

            if not booked:
                return False, "Lot already released."

            if current_user_id != user_id:
                return False, "Unauthorized action: lot is booked by another user."

            if booked_at is None:
                return False, "Invalid lot state: no booking time available."
            
            floor = int(lot_id.split('-')[0])
            booked_time = datetime.fromisoformat(booked_at)
            elapsed_hours = ((datetime.now() - booked_time).seconds + 3599) // 3600
            cost = COST_PER_HOUR[floor] * elapsed_hours

            self.cursor.execute(
                '''UPDATE users SET usage_bill = usage_bill + ? WHERE id = ?''', (cost, user_id)
            )

            self.cursor.execute(
                '''UPDATE parking_lots SET booked = FALSE, user_id = NULL, booked_at = NULL WHERE id = ?''', (lot_id,)
            )

            self.db.commit()
            return True, f"Lot released successfully. Total cost: ₹{cost}."

        except Exception as e:
            self.db.rollback()
            return False, f"Error: {e}"

            