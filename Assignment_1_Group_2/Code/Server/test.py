import sqlite3
from datetime import datetime

from database import DatabaseManager

# Constants for testing
N_FLOORS = 2
N_ROWS = 3
N_COLS = 3
COST_PER_HOUR = {1: 50, 2: 70}

# Initialize DatabaseManager
db_manager = DatabaseManager()

# Test create_user
print("Testing create_user...")
success, message = db_manager.create_user("test_user", "password123", "test_user@example.com", "1234567890")
print(f"Create user: {success}, {message}")

# Test duplicate user creation
success, message = db_manager.create_user("test_user", "password123", "test_user@example.com", "1234567890")
print(f"Duplicate user: {success}, {message}")

# Test get_user
print("Testing get_user...")
user = db_manager.get_user("test_user")
print(f"Get user: {user}")

# Test get_all_users
print("Testing get_all_users...")
users = db_manager.get_all_users()
print(f"All users: {users}")

# Test update_user
print("Testing update_user...")
success = db_manager.update_user("test_user", email="updated_email@example.com")
print(f"Update user email: {success}")

# Test delete_user
print("Testing delete_user...")
success = db_manager.delete_user("test_user")
print(f"Delete user: {success}")

# Test parking lot initialization
print("Testing parking lot initialization...")
lots_info = db_manager.get_lots_info()
print(f"Total parking lots: {len(lots_info)}")

# Test book_lot
print("Testing book_lot...")
db_manager.create_user("test_user2", "password123", "test_user2@example.com", "0987654321")
user = db_manager.get_user("test_user2")
success, message = db_manager.book_lot(user.user_id, "1_1_1")
print(f"Book lot: {success}, {message}")

# Test book the same lot again
success, message = db_manager.book_lot(user.user_id, "1_1_1")
print(f"Book already booked lot: {success}, {message}")

# Test release_lot
print("Testing release_lot...")
success, message = db_manager.release_lot("1_1_1", user.user_id)
print(f"Release lot: {success}, {message}")

# Test release an already released lot
success, message = db_manager.release_lot("1_1_1", user.user_id)
print(f"Release already released lot: {success}, {message}")

# Clean up
print("Cleaning up...")
db_manager.delete_user("test_user2")

print("All tests completed.")
