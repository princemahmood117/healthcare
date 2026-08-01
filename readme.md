# 🏥 Health Care Management System — Backend

A robust, role-based backend API for a Health Care Management platform, built with a modern TypeScript stack. It handles patient, doctor, and admin workflows including secure authentication, email OTP verification, appointment and prescription management, and more.

---

## 📸 Screenshot


![Screenshot](https://i.ibb.co.com/wZZtv9Xy/image.png)

---

## 🚀 Tech Stack

### **Express.js**
A minimal and flexible Node.js web framework used as the foundation of the REST API. It handles routing, middleware composition, and request/response lifecycle management across all modules (auth, patients, doctors, appointments, etc.).

### **PostgreSQL**
A powerful, open-source relational database used as the primary data store. It reliably manages structured, relational data such as users, roles, appointments, prescriptions, and health records with strong consistency guarantees.

### **Prisma**
A next-generation ORM used to interact with PostgreSQL in a fully type-safe way. Prisma Client auto-generates TypeScript types from the schema, and Prisma Migrate handles version-controlled database migrations — reducing runtime errors and keeping the schema in sync with code.

### **Zod**
A TypeScript-first schema validation library used to validate and parse incoming request payloads (e.g. registration, login, appointment creation). Zod ensures data integrity at runtime and provides clear, type-inferred validation errors before data ever reaches the database.

### **Better-Auth**
A modern authentication library used to handle core auth flows — email/password sign-up and sign-in, session management, and email verification via OTP. It integrates directly with Prisma and provides a plugin system (used here for `emailOTP` and `bearer` token support) to customize authentication behavior for this project's role-based system (Patient, Doctor, Admin, Super Admin).

### **Nodemailer**
A Node.js library used to send transactional emails via SMTP (Gmail in this project). It powers the email verification (OTP) flow, rendering dynamic HTML email templates and dispatching them to users during sign-up and other verification events.

### **EJS (Embedded JavaScript Templates)**
A lightweight templating engine used to generate dynamic HTML content for outgoing emails (e.g. OTP verification emails), injecting user-specific data like name, OTP code, and expiry time into styled HTML templates.

### **JWT (jsonwebtoken)**
Used to issue and verify short-lived access tokens and longer-lived refresh tokens for stateless API authentication, working alongside Better-Auth's session system to secure protected routes.

### **TypeScript**
The entire backend is written in TypeScript, providing static typing across services, controllers, interfaces, and utilities — catching errors at compile time and improving long-term maintainability.

### **http-status**
A utility package providing readable, standardized HTTP status code constants (e.g. `status.OK`, `status.BAD_REQUEST`) used throughout error handling and API responses for consistency.

---

## ✨ Key Features

- 🔐 Role-based authentication (Patient, Doctor, Admin, Super Admin)
- 📧 Email OTP verification on sign-up using Nodemailer + EJS templates
- 🔄 Access & refresh token flow with secure HTTP-only cookies
- 🧾 Type-safe request validation with Zod
- 🗄️ PostgreSQL database managed via Prisma ORM
- 🩺 Patient, Doctor, Appointment, and Prescription management
- 🚦 Centralized error handling with custom `AppError`

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for SMTP

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd health-care-management-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then fill in your own values

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=
NODE_ENV=

DATABASE_URL="database url"

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=

BETTER_AUTH_SESSION_EXPIRES_IN=
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=

EMAIL_SENDER_SMTP_USER=
EMAIL_SENDER_SMTP_PASS=
EMAIL_SENDER_SMTP_HOST=
EMAIL_SENDER_SMTP_PORT=
EMAIL_SENDER_SMTP_FROM=
```

---