# A1-Smart-Parking-System Group 2

## Overview

Web-based parking management system with real-time slot booking and monitoring capabilities across multiple parking levels.

## Features

- User Authentication (Signup/Login)
- Multi-level Parking Management (3 Levels)
- Real-time Slot Booking
- Interactive Parking Map
- Booking History Tracking
- Secure JWT Authentication

## Technology Stack
- **Frontend**: React.js, Material-UI
- **Backend**: Flask (Python)
- **Database**: SQLite
- **Authentication**: JWT
- **API Testing**: Postman

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm/yarn

### Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python smart_parking.py
```

### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

## Usage Guide

###  1. User Registration

- Navigate to signup page
- Enter credentials (username, password, email, phone)
- Submit registration form

### 2. Login

- Enter username and password
- System generates JWT token
- Access granted to dashboard

### 3. Parking Operations

- View available slots across 3 levels
- Select desired parking slot
- Confirm booking
- View booking history
- Release slot when needed

### 4. API Endpoints

- ```/signup``` - User registration
- ```/signin``` - User authentication
- ```/userInfo``` - Get user details
- ```/lotBook``` - Book parking slot
- ```/lotsInfo``` - View available slots


## Testing
```
# Run Backend Tests
python -m pytest tests/

# Run Frontend Tests
npm test
```

## Contributors

- Luv Sharma
- Sameer Gupta
- Krish Mittal
- Bilal Muhammad Khan
- Ch Sunil Patra

