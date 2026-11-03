# 🏥 i_CarePlus – Professional Hospital Management System

> **"Your Health, Our Priority."**  
> A complete, enterprise-grade, full-stack Hospital Management System built with **React.js, Node.js, Express.js, and MySQL (via Prisma ORM)**.

---

## 🌟 Project Overview

**i_CarePlus** is a multi-role hospital management web platform engineered to modernize clinical scheduling, electronic health records (EHR), physician operations, digital prescriptions, and transparent billing.

It features two distinct, role-separated workspaces:
1. **Patient Portal**: Personalized dashboard, doctor search by specialty, real-time appointment booking with collision-prevention, digital prescriptions with printable layouts, verifiable electronic medical records, and simulated billing with demo payment gateways.
2. **Admin Workspace**: Executive statistics, interactive Recharts visualizations (monthly trends, appointment statuses, department loads), doctor credentialing, department configuration, appointment oversight, patient registry, financial invoice generation, and printable audit reports.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, JavaScript (ES6+), React Router DOM v6, Tailwind CSS v3, Axios, Lucide React Icons, Recharts |
| **Backend** | Node.js, Express.js, REST API, JSON Web Tokens (JWT), bcryptjs, Morgan, CORS, dotenv |
| **Database** | MySQL (XAMPP / Standalone), Prisma ORM v5, Foreign Keys, Cascade Controls, Relational Indexes |
| **Security** | Role-Based Access Control (RBAC), bcryptjs salted password hashing, JWT bearer verification, patient data ownership enforcement |

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with realistic healthcare demo records. You can sign in immediately using either account:

### 1. Hospital Administrator
* **Portal URL**: `http://localhost:5173/admin/login`
* **Email**: `admin@icareplus.com`
* **Password**: `Admin@123`
* **Role**: `ADMIN` (Super Administrator with full clinical, financial, and doctor management access)

### 2. Valued Patient
* **Portal URL**: `http://localhost:5173/login`
* **Email**: `patient@icareplus.com`
* **Password**: `Patient@123`
* **Role**: `PATIENT` (Primary demo patient: *Marcus Aurelius Miller*)

*(Both login screens include a 1-click **"Auto Fill"** demo button for quick evaluation)*

---

## 📂 Project Architecture & Folder Structure

```
i-careplus/
├── package.json                    # Root scripts for client & server
├── README.md                       # Comprehensive documentation
├── client/                         # React + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                # React Entrypoint
│       ├── App.jsx                 # App root with AuthProvider & Router
│       ├── index.css               # Tailwind & custom print styles
│       ├── context/
│       │   └── AuthContext.jsx     # Authentication state & JWT handling
│       ├── services/               # Modular Axios API services
│       │   ├── api.js              # Central Axios instance with interceptors
│       │   ├── authService.js
│       │   ├── patientService.js
│       │   ├── doctorService.js
│       │   ├── departmentService.js
│       │   ├── appointmentService.js
│       │   ├── medicalRecordService.js
│       │   ├── prescriptionService.js
│       │   ├── billingService.js
│       │   ├── dashboardService.js
│       │   └── reportService.js
│       ├── components/
│       │   ├── common/             # Reusable UI (Navbar, Footer, Modal, Badge, StatCard, Spinner)
│       │   ├── patient/            # Patient components & printable modals (Prescription, Invoice, Payment)
│       │   └── admin/              # Admin components & modal editors (Doctor, Dept, Appointment, Invoice)
│       ├── layouts/
│       │   ├── PublicLayout.jsx    # Public website layout with Navbar & Footer
│       │   ├── PatientLayout.jsx   # Patient portal sidebar & top navigation
│       │   └── AdminLayout.jsx     # Admin executive workspace layout
│       ├── routes/
│       │   ├── AppRoutes.jsx       # Complete route mappings
│       │   └── ProtectedRoute.jsx  # Role-based route guard
│       └── pages/
│           ├── public/             # Home, About, Services, Doctors, Departments, Contact, Logins, Register
│           ├── patient/            # Dashboard, Book, Appointments, Doctors, Records, Prescriptions, Billing, Profile, Settings
│           └── admin/              # Dashboard, Appointments, Patients, Doctors, Departments, Billing, Reports, Settings
└── server/                         # Express.js + Prisma ORM Backend
    ├── package.json
    ├── .env
    ├── .env.example
    ├── prisma/
    │   ├── schema.prisma           # Relational schema (13 tables, relations, foreign keys)
    │   └── seed.js                 # Realistic seed data script
    └── src/
        ├── app.js                  # Express middleware, CORS, and route mounting
        ├── server.js               # Database connection and HTTP server bootstrap
        ├── config/
        │   └── db.js               # Prisma client singleton
        ├── middleware/
        │   ├── authMiddleware.js   # JWT verification & user attachment
        │   ├── adminMiddleware.js  # Strict role check for ADMIN
        │   └── errorHandler.js     # Unified error response formatting
        ├── controllers/            # Controller business logic
        └── routes/                 # REST endpoints
```

---

## 📋 Prerequisites

Before running the application locally, ensure you have:
1. **Node.js**: v18.0.0 or higher (`node -v`)
2. **npm**: v9.0.0 or higher (`npm -v`)
3. **MySQL Server**: Running on port `3306` (e.g. via XAMPP MySQL, WAMP, Docker, or native MySQL 8.x)

---

## 🚀 Quick Setup & Installation Guide

### Step 1: Navigate to Project Directory
```bash
cd "C:\Users\Prince Darji\.gemini\antigravity\scratch\i-careplus"
```

### Step 2: Configure MySQL Database
Make sure MySQL is running on port `3306`.
Create the database:
```sql
CREATE DATABASE IF NOT EXISTS icareplus_db;
```

### Step 3: Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/icareplus_db"
JWT_SECRET="icareplus_super_secret_jwt_key_2026_secure"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```
*(Adjust the MySQL username/password in `DATABASE_URL` if you have a custom root password, e.g., `mysql://root:password@localhost:3306/icareplus_db`)*.

### Step 4: Install Dependencies & Setup Database
```bash
# 1. Install server packages
cd server
npm install

# 2. Push schema to MySQL database
npx prisma db push

# 3. Seed demo data (1 admin, 11 patients, 8 doctors, 8 departments, 18 appointments, medical records, invoices)
node prisma/seed.js

# 4. Install client packages
cd ../client
npm install
```

---

## 🏃 Running the Application

### Option A: Run Both Together (from Root)
In the project root:
```bash
# Start backend server
npm run server

# In a separate terminal, start frontend client
npm run client
```

### Option B: Run Individually
* **Backend Server**:
  ```bash
  cd server
  npm run dev
  # Server starts on http://localhost:5000
  ```

* **Frontend Client**:
  ```bash
  cd client
  npm run dev
  # Frontend starts on http://localhost:5173
  ```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🩺 Key Features Implemented

### 1. Public Hospital Portal
- **Header & Footer**: Comprehensive navigation, 24/7 emergency dispatch hotline (`+1 (800) 911-CARE`), hospital locations, and direct portal links.
- **Hero Section**: Healthcare imagery, headline *"Your Health, Our Priority."*, quick scheduling CTAs, live hospital status badge.
- **Clinical Departments**: 8 core departments (Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, Dentistry, Gynecology).
- **Certified Doctors Directory**: Physician profile cards, qualifications, specialization, years of experience, and OPD consultation fees.
- **Services & About Pages**: Tertiary clinical scope, trauma protocols, and leadership information.
- **Patient Registration & Login**: Instant patient account creation and credential verification.

### 2. Patient Portal
- **Dashboard**: Real-time stats (Total visits, Upcoming, Completed, Pending dues), "Next Appointment" card, recent electronic prescriptions, and recent medical records.
- **Book Appointment (Collision-Safe)**:
  - Select physician with live fee and department info.
  - Choose consultation date and time slot (e.g. 10:00 AM).
  - Built-in duplicate slot collision prevention returns friendly error if an appointment already exists for that doctor on that date/time.
  - Automatically generates an electronic medical invoice linked to the consultation.
- **My Appointments**: Comprehensive table with status filters (Pending, Confirmed, Completed, Cancelled), details modal, and cancellation actions.
- **Medical Records**: Read-only patient access to verified diagnoses, treatment summaries, notes, and vitals (Blood pressure, heart rate, temperature, weight, oxygen saturation).
- **Electronic Prescriptions (Rx)**: Complete medication schedules, dosages, frequencies, and **printable prescription layouts** with digital physician signature blocks.
- **Billing & Simulated Payments**:
  - Itemized consultation bills.
  - Printable medical invoices.
  - **Simulated Payment Gateway**: Clear academic demo checkout supporting Instant Online, Demo Card, and Insurance claims. Updates MySQL status to `PAID` with unique transaction IDs (`TXN-xxxxxxx-ICP`).
- **Profile & Settings**: Edit demographics, blood group, emergency contact, known allergies, medical history, notification preferences, and securely update password.

### 3. Admin Workspace
- **Executive Dashboard**:
  - Stat cards: Total Patients, Active Doctors, Total Appointments, Today's Consultations, Active Departments, Total Revenue.
  - **Recharts Data Visualizations**: Monthly appointment volume area chart, consultation status distribution donut chart, department workload breakdown.
  - Quick action buttons: Onboard Doctor, Add Department, Generate Invoice.
- **Patient Management**: Search, filter by gender/blood group, view complete clinical records, toggle account status (Active/Inactive).
- **Doctor Management**: Onboard new physicians with auto-credentialing, edit fees and working hours, assign departments, and deactivate accounts.
- **Department Management**: Configure clinical departments, codes, department heads, and doctor assignments.
- **Appointment Central**: Filter by date, doctor, department, or status; one-click status transitions (Pending ➔ Confirmed ➔ Completed / Cancelled); manage clinical notes.
- **Billing Management**: Issue manual invoices for laboratory, surgery, or OPD care; monitor revenue; update payment statuses.
- **Clinical Reports**:
  - Appointment volume & doctor workload audit.
  - Revenue collections by payment method.
  - Patient demographics breakdown (gender and blood groups).
  - Print/save PDF capability.
- **Hospital Settings**: Update hospital name, emergency contact hotline, working hours, and administrator credentials.

---

## 🛡️ Security & Role-Based Access Control (RBAC)

1. **Password Security**: Passwords are never stored in plaintext; hashed with `bcryptjs` using a salt work factor of 10.
2. **Session Integrity**: Stateless JSON Web Tokens (JWT) signed with environment secrets and verified on every protected API call via Express middleware.
3. **Separation of Duties**:
   - `requireAdmin` middleware blocks non-administrators with HTTP 403 Forbidden.
   - Patient endpoints enforce ownership checks so patients can only access their own appointments, records, and invoices.
4. **Input Validation**: Backend sanitization and validation on all registration, booking, and administrative inputs.

---

## 🎓 Academic Submission Statement

This project was developed as a complete full-stack engineering submission demonstrating end-to-end relational database design, secure RESTful API development, robust role-based access control, and modern reactive web UI design.
