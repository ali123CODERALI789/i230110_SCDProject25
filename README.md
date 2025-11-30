![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Ubuntu](https://img.shields.io/badge/Ubuntu-Server-orange)

A comprehensive project demonstrating Docker containerization, environment inconsistency resolution, and full-stack deployment strategies for a Node.js application with MongoDB.

## 📋 Project Overview

This project was developed as part of the **Software Construction & Development (SCD)** course at **FAST NUCES Islamabad**. It showcases the complete lifecycle of containerizing and deploying applications using Docker, addressing real-world deployment challenges.

### 🎯 Objectives
- Demonstrate environment inconsistency challenges
- Implement Docker containerization solutions
- Develop enhanced features for a Node.js application
- Deploy using both manual Docker commands and Docker Compose
- Establish proper CI/CD and version control practices

## 🏗️ Project Structure
SCDProject25/
├── backups/ # Automated backup files
├── data/ # File-based storage data
├── db/ # Database layer
│ ├── file.js # File-based storage implementation
│ ├── index.js # Main database operations
│ ├── mongodb.js # MongoDB connection handler
│ └── record.js # Record validation utilities
├── events/ # Event logging system
├── node_modules/ # Dependencies
├── .env # Environment variables (local)
├── .gitignore # Git exclusion rules
├── Dockerfile # Container definition
├── docker-compose.yml # Multi-container deployment
├── export.txt # Sample data export
├── main.js # Application entry point
├── package.json # Project dependencies
└── README.md # This file

text

## ✨ Features Implemented

### Core CRUD Operations
- ✅ Add records with validation
- ✅ List all records
- ✅ Update existing records
- ✅ Delete records with confirmation

### Enhanced Features
- 🔍 **Search Functionality**: Case-insensitive search by name or ID
- 📊 **Sorting Capability**: Sort by name or creation date (ascending/descending)
- 📁 **Data Export**: Export all records to formatted text file
- 💾 **Automatic Backup**: Automatic backups on all state-changing operations
- 📈 **Data Statistics**: Comprehensive vault statistics and analytics
- 🗄️ **MongoDB Integration**: Database persistence with connection pooling

## 🐳 Docker Implementation

### Container Images
- **scd-25-nodeapp**: Initial application with environment fix
- **scd-project25**: Enhanced application with all features

### Docker Hub Repositories
- [alidockerhub101/scd-25-nodeapp](https://hub.docker.com/r/alidockerhub101/scd-25-nodeapp)
- [alidockerhub101/scd-project25](https://hub.docker.com/r/alidockerhub101/scd-project25)

## 🚀 Deployment Strategies

### Manual Deployment
```bash
# Create private network
docker network create scd-private-network

# Create persistent volume
docker volume create mongodb-data

# Deploy MongoDB
docker run -d --name mongodb --network scd-private-network \
  -v mongodb-data:/data/db -p 27017:27017 mongo:latest

# Deploy Application
docker run -d --name scd-app --network scd-private-network \
  -p 3000:3000 -e MONGODB_URI=mongodb://mongodb:27017/scdvault \
  alidockerhub101/scd-project25
Docker Compose Deployment
bash
# Single command deployment
docker-compose up --build

# Detached mode
docker-compose up -d
🛠️ Installation & Setup
Prerequisites
Ubuntu Server/Desktop 22.04

Docker Engine

Docker Compose

Git

Local Development
bash
# Clone repository
git clone https://github.com/ali123CODERALI789/i230110_SCDProject25.git
cd i230110_SCDProject25

# Install dependencies
npm install

# Set up environment variables
echo "MONGODB_URI=mongodb://localhost:27017/scdvault" > .env

# Start application
npm start
Containerized Development
bash
# Build and run with Docker Compose
docker-compose up --build

# Or run manually
docker build -t scd-project25 .
docker run -p 3000:3000 scd-project25
📊 Application Usage
Main Menu
text
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
Key Features Demonstration
Search Records
Search by name (case-insensitive)

Search by ID (partial or full)

Returns all matching records

Sort Records
Sort by name (A-Z or Z-A)

Sort by creation date (oldest-newest or newest-oldest)

Non-destructive (doesn't modify stored data)

Data Statistics
Total record count

Last modification timestamp

Longest name and character count

Date range of records

🔧 Technical Details
Environment Configuration
Node.js: 18+ (required for fetch API support)

MongoDB: 4.0+ compatible

Docker: 20.10+ recommended

Security Features
Environment variable configuration

Private Docker network isolation

Input validation and sanitization

Secure credential management

Performance Optimizations
Docker layer caching

MongoDB connection pooling

Efficient search algorithms

Optimized sorting implementations

🐛 Problem Solving
Environment Inconsistency
Problem: Application failed with ReferenceError: fetch is not defined in Node.js 16
Solution: Containerized with Node.js 18-alpine base image

Data Persistence
Problem: Container restarts caused data loss
Solution: Implemented Docker volumes for MongoDB data persistence

Deployment Complexity
Problem: Manual Docker commands were error-prone
Solution: Created docker-compose.yml for simplified deployment

📝 Development Workflow
Branch Strategy
master: Production-ready code

feature-development: Feature implementation branch

containerization: Docker configuration branch

Commit Convention
Feature implementations with detailed descriptions

Docker configuration updates

Bug fixes and optimizations

👨‍💻 Author
Muhammad Ali Sajjad

GitHub: @ali123CODERALI789

Docker Hub: alidockerhub101

Student ID: i230110

Institution: FAST NUCES Islamabad

📄 License
This project is developed for educational purposes as part of the SCD course curriculum at FAST NUCES Islamabad.

🙏 Acknowledgments
Original Repository: LaibaImran1500/SCDProject25

Node.js Community for extensive documentation

Docker Team for excellent containerization tools

⭐ If you find this project helpful, please give it a star!

