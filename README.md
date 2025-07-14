<div align="center">

# Etrack Management System

![Version](https://img.shields.io/badge/version-4.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)

**A modern, full-stack solution for property, device, and report management.**

</div>

---

## ✨ Overview

Etrack Management System is a robust platform designed to streamline the management of properties, floors, rooms, devices, and administrative reports. It features a secure, user-friendly interface for administrators and staff to monitor, update, and report on assets in real time.

---

## 🎯 Features

- 🔒 **User Authentication** — Secure login & protected routes
- 📊 **Dashboard** — Key metrics & quick navigation
- 🏢 **Property & Inventory Management** — Add, edit, and view properties, floors, halls, rooms, and devices
- 🗺️ **Building Map Visualization** — Interactive map for spatial management
- 📝 **Reports** — Generate and view detailed reports
- 👤 **Admin Management** — Manage admin details and permissions
- ⚡ **Real-time Updates** — WebSocket support for live data and notifications
- 🌗 **Responsive UI** — Mobile-friendly design with dark mode
- 🧑‍🔧 **Floor Incharge Interface** — Floor incharges can report device issues, including uploading images for better issue tracking

---

## 🧑‍🔧 Floor Incharge Interface

The Floor Incharge interface empowers designated users to:
- 📋 **Report Device Issues:** Quickly report faulty or missing devices on their assigned floor.
- 📷 **Upload Images:** Attach images as evidence or for better description of the device issue.
- 🕒 **Track Report Status:** View the status of submitted reports and receive updates in real time.
- 🗂️ **View Assigned Devices:** See a list of all devices assigned to their floor for easy management.

---

## Folder Structure

```text
Etrack_Mgmt_System/
│
├── e-Track/                # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI components (charts, layout, property, UI)
│   │   ├── context/        # React context providers (Auth, Theme, Reports)
│   │   ├── pages/          # Main app pages (Dashboard, Inventory, Login, etc.)
│   │   ├── utils/          # Utility functions and loaders
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   └── ...
│
├── Etrack_Backend/         # Backend (Node.js/Express)
│   ├── controller/         # API controllers
│   ├── modals/             # Mongoose models (schemas)
│   ├── routers/            # Express route handlers
│   ├── public/             # Static files (e.g., images)
│   └── index.js            # Entry point
│
└── README.md               # Project documentation (this file)
```

---

## 🛠️ Tech Stack

| Frontend           | Backend            | Other Tools        |
|--------------------|--------------------|--------------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat) <br> ![Tailwind](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat) <br> ![Recharts](https://img.shields.io/badge/-Recharts-FF6384?logo=recharts&logoColor=white&style=flat) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat) <br> ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat) <br> ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat) | ![Socket.io](https://img.shields.io/badge/-Socket.io-010101?logo=socket.io&logoColor=white&style=flat) <br> ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat) <br> ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white&style=flat) |

---

## 📸 Screenshots

> _Add your own screenshots here!_
>
> ![Dashboard Screenshot](docs/dashboard-sample.png)

---

## ⚡ Quick Start

> **Frontend (e-Track):**
```sh
cd e-Track
npm install
npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

> **Backend (Etrack_Backend):**
```sh
cd Etrack_Backend
npm install
# Add your .env file for sensitive data (MongoDB URI, JWT secret, etc.)
npm start
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 📚 Usage

- Log in with your credentials
- Navigate via the dashboard: Inventory, Map, Reports, Admin Details, etc.
- Add/manage properties, floors, rooms, and devices
- Generate and view reports for asset tracking and management
- **As a Floor Incharge:**
  - Report device issues directly from your interface
  - Upload images to support your report
  - Track the status of your submitted reports

---

## 🤝 Contribution

> **We welcome contributions!**
>
> 1. Fork the repository
> 2. Create a new branch for your feature or bugfix
> 3. Commit your changes with clear messages
> 4. Open a pull request describing your changes
