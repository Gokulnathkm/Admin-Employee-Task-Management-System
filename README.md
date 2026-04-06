#  Admin & Employee Task Management System


##  Objective

To design and implement a role-based system where:

* Admin manages employee access and assigns tasks
* Employees can view and update their assigned tasks

---

## ⚙️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT

---

##  Features Implemented

###  Admin Portal

* Admin login (default access)
* View registered employees
* Approve employee accounts
* Assign tasks to employees
* Track task progress

###  Employee Portal

* User registration and login
* Login enabled only after admin approval
* View assigned tasks
* Update task status:

  * Pending
  * In Progress
  * Completed

---

##  System Design

* Role-Based Access Control (Admin / Employee)
* JWT-based authentication
* Protected API routes using middleware
* RESTful API architecture

---

##  Project Structure

```bash
backend/
  ├── config/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  └── server.js

frontend/
  ├── src/
  ├── public/
  └── package.json
```

---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/task-management.git
cd task-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---

## 📡 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Admin

* GET `/api/admin/employees`
* PUT `/api/admin/approve/:id`
* POST `/api/admin/task`

### Employee

* GET `/api/employee/tasks`
* PUT `/api/employee/task/:id`

---

##  Assumptions

* Admin credentials are pre-configured
* Employees require approval before accessing the system
* Tasks are simple To-Do items without deadlines

---

##  Future Improvements

* Add task deadlines and reminders
* Email notifications for approvals
* Dashboard analytics
* Deployment with live demo

---

##  Submitted By

**Gokul**
