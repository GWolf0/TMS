# TMS (Transportation Management System)

## Description
A multi-tenant application designed to manage employee transportation.

## Contents
- [Features](#features)
- [Teck Stack](#tech-stack)
- [Running Locally](#running-locally)
- [Personal Dev Journey](#personal-dev-journey)
- [Todo](#todo)
- [Gallery](#gallery)

## Features
- **Role-based access** (Admin, Employee, Driver)
- Separate UI interface based on user role
- CRUD functionalities for admin users
- Manual dispatching of reservations (admin users)
- Employees can reserve or cancel a **reservation** (dropoff/pickup)
- Drivers can update availability and view assigned shifts
- Scheduled job for processing reservations (dropoff/pickup)
- **Extra features:**
  - Password reset
  - Dark/light mode
  - Localization setup *(incomplete)*

## Tech Stack
- **Backend:** Laravel
- **Frontend:** Inertia.js (React + TypeScript)
- **Styling:** Tailwind CSS, Shadcn UI
- **Database:** MySQL

## Running Locally

### Method 1 (Local PHP/MySQL server)
**Requirements:** `git`, `npm`, PHP/MySQL server (e.g., XAMPP), `composer`
1. Clone the project  
2. Install dependencies:  
   ```bash
    composer install
    npm install
    php artisan migrate:fresh --seed
    composer run dev
    ```
### Method 2 (Docker)
**Requirements:** `git`, `docker`
1. Clone the project
2. Navigate to the project root (where docker-compose.yml is)
3. Build and run:
    ```bash
    docker-compose up --build
    ```
4. The container exposes:
    - **Web server:** localhost:8000
    - **PHPMyAdmin:** localhost:80 (user: tmsuser, password: secret)
    - **Mailpit:** localhost:8025
5. Test Credentials:
    - Admin: admin@email.com / password
    - Employee: employee@email.com / password
    - Driver: driver@email.com / password

## Personal Dev Journey
This project took approximately 2.5 months (non-continuous) from June to August 2025 and is not yet 100% complete.

The idea came from a similar application I used for reserving seats at a company I briefly worked for.

**What I learned:**

- Real CRUD applications require careful planning.
- Database schema design is one of the most important early stages.
- Implementing “boring” but essential features (authentication, email verification, password reset) is unavoidable.
- Bridging backend and frontend data can be tricky when using different languages.
- Policies/authorizations and validation are mandatory.
- TypeScript helps define shared backend/frontend data models.
- A helper function for flexible filtering/sorting queries is very useful.
- A CRUD-heavy application benefits from a few essential components:
    * Flexible form component
    * Search/filter component
    * Data table component
- Operations involving multiple actors (like reservation processing) are much harder without domain expertise.
- General reusable practices:
- Send user-friendly labels for foreign key fields instead of raw IDs.
- Provide a paginated {id, label} list for dropdowns.
- Keep a typed list of available backend requests (endpoint, method, params).
- Define clear response interfaces (DOE: Data or Error).
- Write unit/feature tests to prevent regressions.
- Even with planning, bugs appear unexpectedly.
- Commenting is good, but can feel overwhelming for side/portfolio projects.

### Todo
- [ ] Test near real-world reservation processing
- [ ] Complete localization data
- [ ] Perform final end-to-end test

## Gallery
ER Diagram
![er diagram](./misc%20resources/ERD.jpeg)

Demo Video
[demo video](./misc%20resources/TMS%20Demo%20Video.mp4)

Screenshot 1
![screenshot 1](./misc%20resources/tms_1.png)

Screenshot 2
![screenshot 2](./misc%20resources/tms_2.png)