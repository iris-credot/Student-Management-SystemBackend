# 🎓 Student Management System Backend

This is a Node.js and Express-based backend API for managing users and students. It supports user authentication, student records management, role-based access control, and MongoDB as the database.

---

## 🚀 Features

- User registration and login with JWT authentication
- Admin-only student management (CRUD operations)
- Role-based access control (admin vs. normal user)
- Environment variable configuration via `.env`
- MongoDB database connection using Mongoose
- Swagger integration for API documentation (optional)

---
## 🧰 Swagger Documentation
Link– [Swagger_Documentation](https://student-management-systembackend.onrender.com/studentSwagger/)

## 🧰 Technologies Used

- Node.js
- Express
- MongoDB (Mongoose)
- JWT for Authentication
- dotenv for environment variables
- bcryptjs for password hashing
- Swagger 

---

## 🗂️ Folder Structure

├── Controllers/

│ ├── authController.js
│ ├── studentController.js
│ └── userController.js

├── Middleware/

│ ├── Authenticator.js
│ └── sendMails.js

├── Models/

│ ├── User.js

├── Routes/

│ ├── authRoute.js
│ ├── studentRoute.js
│ └── userRoute.js

├── .env

├── index.js

└── package.json



## ⚙️ Setup Instructions

### 1. Clone the Repository


git clone https://github.com/iris-credot/Student-Management-SystemBackend.git

cd Student-Management-SystemBackend

### 2. Install Dependencies

npm install

### 3. Create a .env File

Create a .env file in the root directory and add the following variables:

PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key



### 4. Start the Server
npm start



## 📡 API Endpoints

### Auth Routes (/api/auth)

POST /register – Register a new user

POST /login – Login and receive token

POST /logout – Logout user

### 👤 User Routes (/api/users)

GET /me – Get logged-in user profile

PUT /me – Update own profile

PUT /role/:id – Admin only: Update user role

### 🎓 Student Routes (/api/students)

GET / – Admin only: Get all students

GET /:id – Admin only: Get single student

POST / – Admin only: Add student

PUT /:id – Admin only: Update student

DELETE /:id – Admin only: Delete student



## 🔒 Role-Based Access
Endpoint	      Access

/api/auth/* 	  Public

/api/users/me	  Authenticated Users

/api/students/*	  Admin Only


## 🧪 Testing (Recommended Tools)
Postman

Thunder Client (VS Code)


## 📝 License
MIT

## 👤 Author
Iris Credot Teta – tetairiscredot@gmail.com