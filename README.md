# Blog Application

A full-stack MERN (MongoDB, Express, React, Node.js) blogging platform with features for creating, reading, updating, and managing blog posts with user authentication, comments, and notifications.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Database Models](#database-models)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

This is a comprehensive blogging application that allows users to:
- Create and publish blog posts
- Edit and delete their own posts
- Read and explore posts from other users
- Comment on blog posts
- Receive notifications
- Manage user profiles with authentication

The application is split into two main parts:
- **Backend (Blog_Server)**: Node.js/Express REST API with MongoDB
- **Frontend (Blog_client)**: React application with Vite/Create React App

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: Bcrypt
- **Image Storage**: Cloudinary
- **File Upload**: Multer with Cloudinary Storage
- **Middleware**: CORS, Compression
- **Development**: Nodemon

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Editor**: Editor.js with plugins
- **UI Framework**: Flaticon UIcons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Backend Integration**: Firebase (optional)

## ✨ Features

### User Management
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- User profiles

### Blog Management
- Create, read, update, and delete blog posts
- Rich text editor with Editor.js
- Image uploads via Cloudinary
- Blog search and filtering

### Comments & Interactions
- Comment on blog posts
- Comment management
- Reply to comments (if implemented)

### Notifications
- Real-time notifications
- Notification management
- User notification preferences

### Performance
- Response compression
- Optimized payload handling
- Efficient database queries

## 📁 Project Structure

```
Blog_Application/
├── Blog_Server/                 # Backend Application
│   ├── Controllers/             # Business logic for routes
│   ├── Models/                  # MongoDB schemas
│   │   ├── UserModel.js
│   │   ├── BlogModel.js
│   │   ├── CommentModel.js
│   │   └── NtfcnModel.js
│   ├── Routers/                 # API route definitions
│   │   ├── UserRouters.js
│   │   ├── BlogRouter.js
│   │   ├── CommentRouters.js
│   │   └── NtfcnRouter.js
│   ├── Middleware/              # Express middleware
│   │   └── AuthMiddleware.js
│   ├── cloudnry_conf/           # Cloudinary configuration
│   ├── App.js                   # Express app setup
│   ├── .env                     # Environment variables
│   └── package.json
│
├── Blog_client/                 # Frontend Application
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   └── App.jsx
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── .env                     # Environment variables
│
└── README.md                    # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (Local or MongoDB Atlas account)
- **Cloudinary Account** (for image hosting)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blog_Application
```

### 2. Install Backend Dependencies

```bash
cd Blog_Server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Blog_client
npm install
```

## 🔐 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `Blog_Server` directory:

```env
# Server Configuration
PORT=5000
DB=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (if applicable)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend Environment Variables

Create a `.env` file in the `Blog_client` directory:

```env
REACT_APP_API_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000

# Firebase Configuration (if using Firebase)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd Blog_Server
npm start
```

The server will run at `http://localhost:5000`

### Start the Frontend Application

In a new terminal:

```bash
cd Blog_client
npm start
```

The client will run at `http://localhost:3000`

## 📡 API Routes

### User Routes (`/user`)
- `POST /user/register` - Register a new user
- `POST /user/login` - Login user
- `GET /user/:id` - Get user profile
- `PUT /user/:id` - Update user profile
- `DELETE /user/:id` - Delete user account

### Blog Routes (`/blog`)
- `GET /blog` - Get all blogs
- `GET /blog/:id` - Get single blog
- `POST /blog` - Create new blog (requires authentication)
- `PUT /blog/:id` - Update blog (requires authentication)
- `DELETE /blog/:id` - Delete blog (requires authentication)
- `GET /blog/search/:query` - Search blogs

### Comment Routes (`/comment`)
- `GET /comment/:blogId` - Get comments for a blog
- `POST /comment` - Create comment (requires authentication)
- `PUT /comment/:id` - Update comment (requires authentication)
- `DELETE /comment/:id` - Delete comment (requires authentication)

### Notification Routes (`/ntfcn`)
- `GET /ntfcn/:userId` - Get user notifications
- `POST /ntfcn` - Create notification
- `PUT /ntfcn/:id` - Mark notification as read
- `DELETE /ntfcn/:id` - Delete notification

## 🗄️ Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profile: String,
  bio: String,
  createdAt: Date
}
```

### Blog Model
```javascript
{
  title: String,
  content: Object (Editor.js format),
  author: ObjectId (User reference),
  coverImage: String (Cloudinary URL),
  tags: [String],
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,
  author: ObjectId (User reference),
  blog: ObjectId (Blog reference),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  user: ObjectId (User reference),
  type: String,
  message: String,
  read: Boolean,
  createdAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💼 Author

**Sonali Soni**

## 🔗 Live Demo

- Frontend: [https://bloghub-website.netlify.app](https://bloghub-website.netlify.app)

## 📞 Support

For support, please open an issue on the GitHub repository.

---

Happy Blogging! 📝✨
