# 📁 Project File Structure & Details

## 🗂️ Complete Directory Tree

```
c:\tugas sem 6\Komputasi Awan\uts/
│
├── 📄 .gitignore                              [Excludes: node_modules, .env, *.log]
│
├── 📄 README.md                               [Main documentation - 3000+ words]
│   └─ Full project overview, setup, features, architecture
│
├── 📄 QUICKSTART.md                           [10-minute quick setup]
│   └─ Fastest way to get running locally
│
├── 📄 SETUP-GUIDE.md                          [Complete step-by-step guide - 2000+ words]
│   └─ Detailed instructions with examples
│
├── 📄 API-DOCS.md                             [REST API reference]
│   └─ All 16 endpoints with examples & cURL
│
├── 📄 INDEX.md                                [Documentation index & navigation]
│   └─ Quick links to relevant documentation
│
├── 📄 PROJECT-SUMMARY.md                      [Project overview & summary]
│   └─ Architecture, checklist, tech stack
│
├── 📄 deploy.sh                               [Bash deployment script]
│   └─ Automated deployment to server
│
│
├── 📁 frontend/                               [User Interface - Web Application]
│   │
│   ├── 📄 index.html                          [445 lines]
│   │   ├─ Navigation tabs (Rumah, Petugas, Jadwal)
│   │   ├─ 3 CRUD modal forms
│   │   ├─ Interactive calendar
│   │   ├─ Data tables
│   │   ├─ Modal dialogs untuk confirmation
│   │   └─ Semantic HTML5 structure
│   │
│   ├── 📄 style.css                           [700 lines]
│   │   ├─ Responsive grid layouts
│   │   ├─ Purple gradient theme (sampah colors)
│   │   ├─ Modal & form styles
│   │   ├─ Calendar styling
│   │   ├─ Mobile, tablet, desktop breakpoints
│   │   ├─ Hover effects & animations
│   │   ├─ Notification styles
│   │   └─ Badge & status colors
│   │
│   └── 📄 script.js                           [580 lines]
│       ├─ API Base URL configuration
│       ├─ Data storage variables
│       ├─ Tab switching logic
│       ├─ RUMAH CRUD functions (8 functions)
│       ├─ PETUGAS CRUD functions (8 functions)
│       ├─ JADWAL CRUD functions (8 functions)
│       ├─ Calendar rendering & navigation
│       ├─ Modal management
│       ├─ API calls (fetch)
│       ├─ Form validation
│       ├─ Notification system
│       └─ Event listeners
│
│
├── 📁 backend/                                [Node.js + Express API Server]
│   │
│   ├── 📄 server.js                           [300 lines]
│   │   ├─ Express server initialization
│   │   ├─ Middleware setup (CORS, body-parser)
│   │   ├─ MySQL connection pooling
│   │   ├─ 5 RUMAH endpoints
│   │   ├─ 4 PETUGAS endpoints
│   │   ├─ 5 JADWAL endpoints
│   │   ├─ 1 Health check endpoint
│   │   ├─ Error handling
│   │   ├─ Database queries (prepared statements)
│   │   └─ Port 5000 listener
│   │
│   ├── 📄 package.json                        [Dependencies configuration]
│   │   ├─ express 4.18.2
│   │   ├─ mysql2 3.6.0
│   │   ├─ cors 2.8.5
│   │   ├─ dotenv 16.3.1
│   │   ├─ aws-sdk 2.1400.0
│   │   ├─ body-parser 1.20.2
│   │   ├─ nodemon 3.0.1 (dev)
│   │   └─ Scripts: start, dev
│   │
│   ├── 📄 .env.example                        [Environment template]
│   │   ├─ DB_HOST
│   │   ├─ DB_USER
│   │   ├─ DB_PASSWORD
│   │   ├─ DB_NAME
│   │   ├─ DB_PORT
│   │   ├─ PORT
│   │   ├─ NODE_ENV
│   │   ├─ AWS_REGION
│   │   ├─ AWS_ACCESS_KEY_ID
│   │   └─ AWS_SECRET_ACCESS_KEY
│   │
│   ├── 📄 .env                                [ACTUAL CONFIG - Create this!]
│   │   └─ Copy from .env.example, fill your AWS details
│   │
│   ├── 📄 test-db.js                          [70 lines]
│   │   ├─ Test database connection
│   │   ├─ Display connection info
│   │   ├─ List tables
│   │   ├─ Show row counts
│   │   ├─ Display sample data
│   │   └─ Run: node test-db.js
│   │
│   └── 📄 package-test.json                   [Alternative for testing]
│
│
├── 📁 database/                               [MySQL Database Files]
│   │
│   └── 📄 schema.sql                          [100 lines]
│       ├─ CREATE DATABASE sampash-db
│       ├─ CREATE TABLE rumah
│       │  └─ Columns: id, nama_pemilik, alamat, telepon, zona
│       ├─ CREATE TABLE petugas
│       │  └─ Columns: id, nama, telepon, zona, status
│       ├─ CREATE TABLE jadwal
│       │  └─ Columns: id, id_rumah (FK), id_petugas (FK), tanggal, keterangan
│       ├─ CREATE INDEX untuk columns
│       ├─ INSERT sample data (3 rumah, 3 petugas, 3 jadwal)
│       └─ Run this in AWS RDS MySQL!
│
│
└── 📁 config/                                 [Configuration & Deployment]
    │
    ├── 📄 AWS-SETUP.md                        [2000+ words]
    │   ├─ RDS instance creation step-by-step
    │   ├─ Security group configuration
    │   ├─ Connection string examples
    │   ├─ MySQL CLI setup
    │   ├─ VS Code extension setup
    │   ├─ Best practices & security
    │   ├─ Troubleshooting guide
    │   └─ Cost estimation
    │
    ├── 📄 nginx.conf                          [75 lines]
    │   ├─ HTTP → HTTPS redirect
    │   ├─ SSL certificate paths
    │   ├─ Security headers
    │   ├─ Gzip compression
    │   ├─ Frontend static files
    │   ├─ /api/ proxy to backend
    │   ├─ Cache settings
    │   └─ Proxy timeout configuration
    │
    ├── 📄 sampah-backend.service               [systemd service file]
    │   ├─ Service name: sampah-backend
    │   ├─ After: network.target
    │   ├─ ExecStart: node server.js
    │   ├─ Restart: on-failure
    │   ├─ Environment file: .env
    │   ├─ User: ubuntu
    │   └─ For: sudo systemctl start sampah-backend
    │
    └── 📄 README.md                           [Configuration notes]


═══════════════════════════════════════════════════════════════════
```

## 📊 File Statistics

```
TOTAL FILES: 20
TOTAL LINES: 3000+

BY CATEGORY:
═════════════════════════════════════╦═════════════════════════════╦════════╗
│ Category                            │ Files                       │ Lines  │
╠═════════════════════════════════════╬═════════════════════════════╬════════╣
│ Frontend (HTML/CSS/JS)              │ 3 files                     │ 1725   │
│ Backend (Express.js)                │ 4 files                     │ 370    │
│ Database (SQL)                      │ 1 file                      │ 100    │
│ Documentation (Markdown)            │ 8 files                     │ 900+   │
│ Configuration (Config files)        │ 4 files                     │ 200    │
│ Git & Misc                          │ 1 file (.gitignore)         │ 15     │
╚═════════════════════════════════════╩═════════════════════════════╩════════╝

BREAKDOWN BY LANGUAGE:
═════════════════════════════════════════════════════════════════
JavaScript:     900 lines     (frontend/backend logic)
HTML:           445 lines     (markup)
CSS:            700 lines     (styling)
SQL:            100 lines     (database)
Markdown:       900+ lines    (documentation)
Config:         200 lines     (deployment)
═════════════════════════════════════════════════════════════════
```

## 🔗 File Dependencies & Flow

```
User (Browser)
    ↓
frontend/index.html (UI)
    ├─ Loads: style.css (styling)
    ├─ Loads: script.js (logic)
    └─ Makes API calls to:
        ↓
        backend/server.js:5000
            ├─ Connects to: database (AWS RDS)
            └─ Returns JSON

VS Code Access:
    ├─ Config: backend/.env
    ├─ Test: npm run dev
    ├─ Database: MySQL Extension
    └─ Deploy: bash deploy.sh
```

## 🎯 Entry Points

```
FOR USERS:
├─ Start Reading: README.md
├─ Quick Setup: QUICKSTART.md
└─ Open in Browser: frontend/index.html

FOR DEVELOPERS:
├─ Backend Setup: backend/server.js
├─ Frontend Logic: frontend/script.js
├─ Database: database/schema.sql
├─ API Reference: API-DOCS.md
└─ AWS Setup: config/AWS-SETUP.md

FOR DEVOPS:
├─ Deployment: deploy.sh
├─ Server Config: config/sampah-backend.service
├─ Web Server: config/nginx.conf
└─ AWS Setup: config/AWS-SETUP.md
```

## 📈 Code Organization

### Frontend
```
frontend/
│
├─ HTML (index.html)
│  ├─ Header section
│  ├─ Navigation tabs
│  ├─ Main content (3 tabs)
│  └─ Modals (Rumah, Petugas, Jadwal, Confirm)
│
├─ CSS (style.css)
│  ├─ Global styles
│  ├─ Layout (flex/grid)
│  ├─ Components (buttons, tables, modals)
│  ├─ Theme (colors, fonts)
│  └─ Responsive (media queries)
│
└─ JavaScript (script.js)
   ├─ Configuration
   ├─ Initialization
   ├─ Tab management
   ├─ Rumah CRUD
   ├─ Petugas CRUD
   ├─ Jadwal CRUD
   ├─ Calendar logic
   └─ Utilities (API, notifications)
```

### Backend
```
backend/
│
└─ server.js
   ├─ Imports & configuration
   ├─ Middleware setup
   ├─ Database connection
   ├─ Routes:
   │  ├─ GET/POST/PUT/DELETE /rumah
   │  ├─ GET/POST/PUT/DELETE /petugas
   │  ├─ GET/POST/PUT/DELETE /jadwal
   │  ├─ GET /jadwal/bulan
   │  └─ GET /health
   └─ Server listener
```

## 🔐 Sensitive Files (In .gitignore)

```
.env                    - Actual AWS credentials
.env.local             - Local testing credentials
node_modules/          - Dependencies
*.log                  - Log files
.DS_Store              - macOS files
.vscode/               - VS Code settings
dist/build/           - Build outputs
```

## 🎓 File Reading Order

### For Complete Beginners
1. README.md (overview)
2. QUICKSTART.md (setup)
3. frontend/index.html (see the UI)
4. frontend/script.js (understand logic)
5. API-DOCS.md (see endpoints)

### For Intermediate
1. SETUP-GUIDE.md (detailed steps)
2. backend/server.js (study APIs)
3. database/schema.sql (understand tables)
4. config/AWS-SETUP.md (AWS details)

### For Advanced
1. Project architecture in README.md
2. Source code: all .js/.sql files
3. Deployment: deploy.sh, nginx.conf
4. Security: AWS-SETUP.md best practices

## ✅ Quality Checklist

```
Code Quality:
├─ ✅ No external dependencies for frontend (vanilla JS)
├─ ✅ Clean code with comments
├─ ✅ Consistent naming conventions
├─ ✅ Error handling implemented
├─ ✅ Input validation
└─ ✅ Prepared statements (SQL injection prevention)

Documentation:
├─ ✅ 8 documentation files
├─ ✅ API examples with cURL
├─ ✅ Setup guides (quick & detailed)
├─ ✅ Troubleshooting section
├─ ✅ AWS configuration guide
└─ ✅ Deployment instructions

Features:
├─ ✅ Full CRUD for 3 data models
├─ ✅ Responsive design
├─ ✅ Modal forms
├─ ✅ Calendar view
├─ ✅ API integration
├─ ✅ Error handling
└─ ✅ Success notifications
```

## 🚀 Quick Navigation

```
Need to..                           → Open file...
─────────────────────────────────────────────────────────────────
Understand project                  → README.md
Setup quickly (10 min)              → QUICKSTART.md
Setup thoroughly                    → SETUP-GUIDE.md
Learn all API endpoints             → API-DOCS.md
Find a file                         → This file (INDEX.md)
Setup AWS RDS                       → config/AWS-SETUP.md
Deploy to production                → deploy.sh
Edit backend code                   → backend/server.js
Edit frontend code                  → frontend/script.js
See database schema                 → database/schema.sql
Configure Nginx                     → config/nginx.conf
Setup as systemd service            → config/sampah-backend.service
```

---

**Total Size:** ~3000+ lines of code + documentation
**Complexity:** Medium (suitable for learning)
**Time to Setup:** 10-30 minutes
**Deployment Difficulty:** Easy

**🎉 Project Ready to Use!**
