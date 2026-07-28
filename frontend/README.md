# ReOwnix Premium Service Frontend

## Overview

The ReOwnix Premium Service Frontend is a React-based web application that allows users to explore premium subscription plans, purchase subscriptions, manage their subscription details, and view invoices.

This frontend communicates with the Premium Service ASP.NET Core Web API.

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Bootstrap Icons

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication

---

## Features

- Responsive Home Page
- Premium Plans
- Plan Comparison Table
- FAQ Section
- Secure Payment Page
- Subscription Management
- Invoice Page
- Responsive Navigation Bar
- Professional Footer

---

## Folder Structure

```
src
│
├── assets
├── components
│   ├── common
│   ├── layout
│   └── ui
├── pages
├── routes
├── services
├── App.jsx
├── main.jsx
```

---

## Installation

### Clone the repository

```bash
git clone <https://github.com/Shirish9000/REOWNIX--Verified-Second-Hand-Goods-Marketplace.git>
```

---

### Install dependencies

```bash
npm install
```

---

### Run the application

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## Build

```bash
npm run build
```

---

## Connected Backend

```
https://localhost:7200
```

---

## Authentication

Payment, Subscription, and Invoice APIs are protected using JWT Authentication.

Until the Login Service is integrated, protected APIs will return:

```
401 Unauthorized
```

This is expected during standalone development.

---

## Future Integration

- Login Service
- JWT Token Authentication
- User Profile Service
- Notification Service

---

## Developed By

ReOwnix Development Team