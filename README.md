<h1 align="center"> SEOtron </h1>
<p align="center"> The Intelligent SEO Analysis Platform for Comprehensive Digital Performance Auditing </p>

## 📑 Table of Contents

- [⭐ Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)

---

## ⭐ Overview

**SEOtron** is a powerful, modern web application designed to provide comprehensive Search Engine Optimization (SEO) analysis and performance insights for digital assets. It delivers detailed reports, user analytics, and authenticated data history through a high-speed, interactive user interface.

---

## ✨ Key Features

SEOtron transforms raw data into structured, actionable intelligence through a set of powerful, user-centric capabilities.

### 🚀 High-Performance Analysis Engine
The backend, leveraging **FastAPI**, is optimized for speed, allowing users to initiate complex SEO analyses and receive detailed reports in near real-time. This efficiency is critical for users managing large volumes of data or requiring immediate performance audits.

*   **Benefit:** Minimize wait times for audit results, enabling rapid iteration and decision-making.

### 📊 Comprehensive Reporting Models
The platform utilizes specialized data models (including `MetaTagsModel`, `ContentModel`, `LinksModel`, and `PerformanceModel`) to organize and present complex SEO data across key optimization pillars.

*   **Benefit:** Receive structured, easy-to-understand reports that cover on-page factors, technical SEO scores, and content structure quality.

### 🔒 Secure User Authentication & History
Users are provisioned with secure authentication mechanisms, including login and signup flows (`Login.tsx`, `Signup.tsx`), and JWT-based security (`jwt.py`, `auth.py`). Critical features include database operations for user creation, updating onboarding status, and persistent storage of analysis reports (`database.py`).

*   **Benefit:** Private and secure access to personalized dashboards and historical analysis records (`Dashboard.tsx`, `Profile.tsx`), ensuring data integrity and continuity.

### 🎨 Intuitive, Component-Driven Interface
Built on React and leveraging the Shadcn/ui component library, the frontend provides a rich, modern, and highly interactive experience. Key UI components include:

*   **`SEOanalyzer.tsx` & `GridScan.tsx`:** Dedicated tools for initiating and visualizing deep-dive analysis scans.
*   **`Dashboard.tsx` & `Statistics.tsx`:** Centralized areas for monitoring key metrics and reviewing performance trends using advanced charting libraries.
*   **Pre-built UI Primitives:** Utilizing components like `button.tsx`, `calendar.tsx`, `tabs.tsx`, and `dropdown-menu.tsx` for enhanced user interaction and superior navigation.

*   **Benefit:** An accessible, professional, and visually appealing interface that simplifies the often-complex process of SEO management.

### 💡 Dedicated Modular Services
The architecture separates core logic into distinct services (`seo_service.py` and `analytics_service.py`), ensuring scalability and maintainability for specialized tasks like keyword analysis and aggregated timeseries data generation.

*   **Benefit:** Ensures that analysis calculations are robust, accurate, and can be updated independently without affecting the core application.

---

## 🛠️ Tech Stack & Architecture

SEOtron is built using industry-leading, high-performance technologies, adhering to modern architectural best practices.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **Frontend** | | |
| **React (with TypeScript)** | Dynamic, interactive user interface construction and state management. | Provides a robust component-based architecture for building sophisticated, maintainable single-page applications. |
| **Tailwind CSS** | Utility-first CSS framework for rapid, responsive styling. | Enables highly customizable, clean, and scalable design across all components without writing custom CSS classes. |
| **Shadcn/ui** | Collection of reusable components built on Radix UI and Tailwind CSS. | Accelerates UI development by providing accessible, customizable, and production-ready components. |
| **Backend** | | |
| **FastAPI** | High-performance, asynchronous web framework for building the REST API. | Known for its exceptional speed (comparable to NodeJS and Go), automatic documentation generation, and robust data validation based on Pydantic models. |
| **Architecture** | | |
| **Microservices** | Decoupling analysis logic into distinct services. | Enhances scalability, fault isolation, and independent deployment of core functionalities (SEO analysis, analytics reporting). |
| **REST API** | Standardized, stateless communication layer. | Ensures predictable and efficient communication between the React client and the FastAPI backend. |

---

## 📁 Project Structure

The project is segmented into distinct `server` (FastAPI backend) and `client` (React frontend) directories, reflecting its microservices and component-based design.

```
📂 diyasikka222-SEOtron-694bf43/
├── 📄 .gitignore
├── 📂 server/                   # FastAPI Backend API
│   ├── 📄 database.py           # Database operations (user/report management)
│   ├── 📄 requirements.txt      # Python dependencies
│   ├── 📄 .gitignore
│   ├── 📄 get-pip.py            # Utility script for pip bootstrapping
│   ├── 📄 main.py               # Main FastAPI application entry point
│   ├── 📂 services/             # Core business logic handlers
│   │   ├── 📄 seo_service.py    # Dedicated service for deep SEO analysis (analyze_keyword, get_pagespeed_insights)
│   │   ├── 📄 __init__.py
│   │   └── 📄 analytics_service.py # Service for generating time-series analytics payloads
│   ├── 📂 routes/               # API endpoint definitions
│   │   ├── 📄 __init__.py
│   │   ├── 📄 seo.py            # SEO analysis routes
│   │   ├── 📄 analytics.py      # Analytics data routes
│   │   └── 📄 users.py          # User authentication and management routes
│   ├── 📂 models/               # Pydantic models for data validation and response schemas
│   │   ├── 📄 __init__.py
│   │   ├── 📄 seo.py            # SEO report data models (MetaTags, Headings, Links, Content, Performance, SEOReportModel)
│   │   └── 📄 user.py           # User and onboarding data models
│   └── 📂 utils/                # General utility functions
│       ├── 📄 __init__.py
│       ├── 📄 jwt.py            # JSON Web Token creation and verification
│       └── 📄 auth.py           # Authentication utilities (hashing, password verification)
├── 📂 client/                   # React/TypeScript Frontend Application
│   ├── 📄 package.json          # Node dependencies (React, Shadcn, Tailwind)
│   ├── 📄 LICENSE               # MIT License declaration
│   ├── 📄 vite.config.ts        # Vite configuration
│   ├── 📄 tsconfig.json         # TypeScript configuration
│   ├── 📄 components.json       # Shadcn component configuration
│   ├── 📄 index.html
│   ├── 📄 tailwind.config.js    # Tailwind CSS configuration
│   ├── 📄 package-lock.json
│   ├── 📂 src/                  # Client source code
│   │   ├── 📄 index.css
│   │   ├── 📄 App.tsx           # Main application component
│   │   ├── 📄 main.tsx          # Client entry point
│   │   ├── 📄 api.ts            # Frontend API interaction utilities (Axios)
│   │   ├── 📂 assets/           # Static assets (images, videos, icons)
│   │   │   ├── 📄 looking-ahead.png
│   │   │   ├── 📄 growth.png
│   │   │   ├── 📄 SEOtron_final_motiongraphics.mp4
│   │   │   └── 📄 icon.png
│   │   ├── 📂 components/       # Reusable React components
│   │   │   ├── 📄 Sponsors.tsx
│   │   │   ├── 📄 SEOanalyzer.tsx # Component to initiate and display analysis
│   │   │   ├── 📄 GridScan.tsx    # Visualization component
│   │   │   ├── 📄 HeroCards.tsx
│   │   │   ├── 📄 Pricing.tsx
│   │   │   ├── 📄 Dashboard.tsx   # User's primary landing/management view
│   │   │   ├── 📄 Login.tsx       # Authentication login page
│   │   │   ├── 📄 ProtectedRoute.tsx # Route protection handler
│   │   │   └── 📂 ui/           # Shadcn/ui primitives
│   │   │       ├── 📄 button.tsx
│   │   │       ├── 📄 dropdown-menu.tsx
│   │   │       ├── 📄 card.tsx
│   │   │       └── 📄 tabs.tsx
│   │   └── 📂 lib/              # Utility library files
│   │       └── 📄 utils.ts      # General utility functions
│   └── 📂 public/               # Public static files
│       └── 📄 vite.svg
└── 📂 .idea/                    # IDE specific files (JetBrains)
    ├── 📄 modules.xml
    └── 📄 .gitignore
```

---

## 🚀 Getting Started

As a full-stack application leveraging both Python/FastAPI for the backend and React/TypeScript for the frontend, SEOtron requires separate setup and execution for both environments.

### Prerequisites

To run SEOtron locally, you must have the following installed on your system:

*   **Python 3.x:** Required for the FastAPI backend.
*   **Node.js & npm/yarn:** Required for managing frontend dependencies and running the React client (Primary Language: TypeScript).

### 1. Backend Setup (FastAPI Server)

The server component handles all API routing, data modeling, authentication, and communication with the analysis services.

1.  **Navigate to the Server Directory:**
    ```bash
    cd diyasikka222-SEOtron-694bf43/server/
    ```

2.  **Install Python Dependencies:**
    Install the required packages listed in `requirements.txt`.
    ```bash
    # Ensure you are using a virtual environment (recommended)
    python3 -m venv venv
    source venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Run the FastAPI Application:**
    Since no dedicated entry script was detected, the application is started via the main file or a common ASGI server (like uvicorn, which is typically installed via `requirements.txt`):
    ```bash
    # Example command to start the server (verify actual command based on environment)
    uvicorn main:app --reload
    ```

### 2. Frontend Setup (React Client)

The client component, built with React and TypeScript, provides the user interface for interacting with the analysis platform.

1.  **Navigate to the Client Directory:**
    ```bash
    cd diyasikka222-SEOtron-694bf43/client/
    ```

2.  **Install Node Dependencies:**
    Dependencies are managed via `package.json` (including `react`, `typescript`, `axios`, `framer-motion`, and `shadcn/ui` dependencies).
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Run the Client Application:**
    The client uses Vite for its build and development environment.
    ```bash
    npm run dev
    # This command starts the frontend application, typically accessible at http://localhost:5173
    ```

