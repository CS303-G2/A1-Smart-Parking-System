import sqlite3
from datetime import datetime

from database import DatabaseManager

# Constants for testing
N_FLOORS = 3
N_ROWS = 100
N_COLS = 100
COST_PER_HOUR = {1: 50, 2: 70}

db_manager = DatabaseManager('database_n2.db')

# Test create_user
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing create_user...")
success, message = db_manager.create_user("test_user", "password123", "test_user@example.com", "1234567890")
print(f"Create user: {success}, {message}")
print()

# Test duplicate user creation
success, message = db_manager.create_user("test_user", "password123", "test_user@example.com", "1234567890")
print(f"Duplicate user: {success}, {message}")

# Test get_user
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing get_user...")
user2 = db_manager.get_user("test_user")
print(f"Get user: {user2}")
print()

# Test get_all_users
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing get_all_users...")
db_manager.create_user("test_user2", "password123", "test_user2@example.com", "9234567890")
users = db_manager.get_all_users()
print(f"All users: {users}")
print()

# Test update_user
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing update_user...")
success = db_manager.update_user("test_user", email="updated_email@example.com")
print(f"Update user email: {success}")
print()

# Test delete_user
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing delete_user...")
success = db_manager.delete_user("test_user")
print(f"Delete user: {success}")
print()

# Test parking lot initialization
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing parking lot initialization...")
lots_info = db_manager.get_lots_info()
print(f"Total parking lots: {len(lots_info)}")
print()

# Test book_lot
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing book_lot...")
db_manager.create_user("test_user2", "password123", "test_user2@example.com", "0987654321")
user = db_manager.get_user("test_user2")
success, message = db_manager.book_lot(user.user_id, "1_1_1")
print(f"Book lot: {success}, {message}")
print()

# Test book the same lot again
print("Testing book_lot for already booked lot...")
success, message = db_manager.book_lot(user.user_id, "1_1_1")
print(f"Book already booked lot: {success}, {message}")
print()

print('Testing book_lot for not-existing lot...')
success, message = db_manager.book_lot(user.user_id, "4_1_1")
print(f"Book not-existing lot: {success}, {message}")
print()

# Test release_lot
print('-----------------------------------------------------------------------------------------------------------------')
print("Testing release_lot...")
success, message = db_manager.release_lot("1_1_1", user.user_id)
print(f"Release lot: {success}, {message}")
print()

# Test release an already released lot
print("Testing release_lot for already released lot...")
success, message = db_manager.release_lot("1_1_1", user.user_id)
print(f"Release already released lot: {success}, {message}")
print()

print('Testing release_lot for not booked lot...')
success, message = db_manager.release_lot("2_1_1", user.user_id)
print(f"Release not booked lot: {success}, {message}")
print()

print('Testing release_lot for not owned lot...')
db_manager.book_lot(user2.user_id, "1_1_1")
success, message = db_manager.release_lot("1_1_1", 1)
print(f"Release not owned lot: {success}, {message}")
print()

print('Testing release_lot for not owned lot...')
db_manager.book_lot(user2.user_id, "2_5_1")
db_manager.book_lot(user2.user_id, "1_2_1")
success= db_manager.get_bookings(user2.user_id)
print(f"Lots booked by User: {success}")
print()


# Clean up
print("Cleaning up...")
db_manager.delete_user("test_user2")

print("All tests completed.")

