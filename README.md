# AntStash 🐜

A GitHub-like version control & collaboration platform built from scratch. AntStash ships its own **Git-style CLI** (`init` / `add` / `commit` / `push` / `pull` / `revert`), stores file contents in **AWS S3**, keeps metadata in **MongoDB**, and serves a **React** web app for browsing repositories, managing issues, and user profiles.

## ✨ Features

- **Custom version-control CLI** — initialize a repository, stage files, commit with messages, push to the cloud, pull changes back, and revert to any commit
- **Cloud object storage** — committed file snapshots are uploaded to an AWS S3 bucket
- **Repository hosting** — create public/private repositories with descriptions and visibility control
- **Issue tracking** — create and browse issues attached to repositories
- **User accounts** — signup/login with JWT authentication and protected routes
- **Real-time layer** — Socket.IO server with per-user rooms for live notifications
- **Web dashboard** — React SPA with auth flow, public repo explorer, and user profile pages

## 🛠️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, Vite, React Router 7 |
| Backend   | Node.js, Express 5, Socket.IO 4 |
| Database  | MongoDB + Mongoose |
| Storage   | AWS S3 (aws-sdk v2) |
| Auth      | bcrypt + JSON Web Tokens |
| CLI       | yargs |

## 📁 Project Structure

```
.
├── backend/
│   ├── index.js              # Entry point: CLI commands (yargs) + Express/Socket.IO server
│   ├── config/               # AWS S3 client configuration
│   ├── controllers/          # Business logic (repos, users, issues, CLI git operations)
│   ├── middleware/           # JWT auth & authorization guards
│   ├── models/               # Mongoose models (User, Repository, Issue)
│   ├── routes/               # Express routers
│   └── .antstash/            # Local repo data created by the CLI (staging, commits)
└── frontend/
    └── src/
        ├── Router.jsx        # Route definitions + auth redirects
        ├── authContext.jsx   # Auth state context
        └── components/       # auth, dashboard, issue, repo, user views
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- An AWS S3 bucket with credentials

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET_KEY=<a-random-secret>
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_REGION=<your-bucket-region>
S3_BUCKET=<your-bucket-name>
```

Start the API server:

```bash
npm start starts        # starts Express + Socket.IO server
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # starts Vite dev server
```

The app runs at `http://localhost:5173` with the API expected on `http://localhost:3000`.

## ⌨️ CLI Commands

Run these from the `backend/` directory (or wherever the CLI is linked). They operate on a local `.antstash/` folder in the current working directory.

| Command | Description |
|---------|-------------|
| `npm start -- init` | Initialize a new AntStash repository |
| `npm start -- add <file>` | Stage a file |
| `npm start -- commit "<message>"` | Commit staged files with a message (UUID commit ID) |
| `npm start -- push` | Upload all local commits to the S3 bucket |
| `npm start -- pull` | Pull committed files back from storage |
| `npm start -- revert <commitID>` | Restore the working state to a specific commit |

## 🔌 API Overview

- `POST /signup`, `POST /login` — user registration & authentication
- `GET/POST /repo` — list public repositories / create a repository
- `POST /repo/:id/issues`, `GET /repo/:id/issues` — issue operations
- User routes for profile & repository ownership

Protected routes require a `Bearer` JWT token.

## 🗺️ Roadmap

- [ ] Issue comments and status lifecycle (open/closed)
- [ ] Repository file browser UI
- [ ] Branches & merge support in the CLI
- [ ] Real-time notifications wired to the dashboard
- [ ] Collaboration (contributors, pull requests)

## 📄 License

ISC
