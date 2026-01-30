# Backend Guide

## Overview
The backend is built with Node.js and Express. It follows a layered architecture:

- **API Layer**: `api/` contains Routes, Controllers, and Validators.
- **Service Layer**: `services/` contains business logic.
- **Data Layer**: `models/` contains Mongoose schemas.

## Key Directories
- `api/routes`: Define API endpoints.
- `api/controllers`: Handle request/response logic.
- `services`: Reusable business logic (AI, Order processing).
- `models`: Database definitions.

## How to Run
1. `npm install`
2. `npm start`
