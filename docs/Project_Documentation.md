# Etrack Management System – Admin/Incharge Frontend Documentation

## Overview
This is the admin/incharge dashboard for the Etrack Management System. It allows management of properties, floors, devices, and reports, with authentication and data visualization features.

## Directory Structure
- `src/` – Source code
  - `components/` – UI and layout components
  - `pages/` – Page-level components (Dashboard, Inventory, Reports, etc.)
  - `context/` – Context providers (Auth, Theme, Reports)
  - `utils/` – Utility functions and loaders
- `public/` – Static assets
- `docs/` – Project documentation (this file)

## Technology Stack
- React, React Router, Tailwind CSS, Axios, Recharts, Framer Motion, Toastify
- Vite for development/build

## Setup & Installation
```bash
cd e-Track
npm install
npm run dev
```

## Main Features
- Authentication and protected routes
- Dashboard with charts and stats
- Inventory and property management
- Building map visualization
- Reports management
- Responsive UI

## Routing Structure
- `/login` – Login page
- `/` – Dashboard (protected)
- `/inventory` – Inventory management
- `/map` – Building map
- `/reports` – Reports
- `/floors/:floorId` – Floor details
- `/floors/:floorId/halls/:hallId` – Hall details
- `/floors/:floorId/halls/:hallId/rooms/:roomId` – Room details
- `/admin-details` – Admin profile
- `/add-floor` – Add new floor

## Usage
- Start the backend server first.
- Run the frontend with `npm run dev`.
- Access the dashboard at the default Vite port (usually 5173).

## Contribution & Linting
- Lint: `npm run lint`
- Contributions: Fork, branch, PR.

## Author
- Main author: Phani 