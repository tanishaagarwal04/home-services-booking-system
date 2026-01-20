# Home Services Booking System

## Overview
This project demonstrates a simplified booking lifecycle for an on-demand home services marketplace.

## Features
- Create booking
- Provider assignment
- Status transitions:
  PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
- Failure handling (cancellation)
- Admin override
- Booking history logs (observability)

## Tech Stack
- Node.js
- Express
- Plain HTML/JavaScript

## How to Run
1. npm install
2. npm start
3. Open http://localhost:3000

## Design Decisions
- In-memory storage used to keep focus on business logic
- Explicit state transitions to avoid invalid flows
- Logs added for observability and debugging
