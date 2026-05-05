# Career Architect

Career Architect is a full-stack MERN application that uploads and parses resumes, extracts skills, compares them with predefined job skill datasets, and generates a prioritized learning path with optional OpenAI-powered suggestions.

## Features

- JWT authentication
- PDF resume upload and parsing
- Resume skill extraction
- Job role skill gap analysis
- Priority-scored learning path
- OpenAI API suggestions
- MongoDB persistence
- React dashboard UI

## Project Structure

```text
career-architect/
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your MongoDB URI, JWT secret, and OpenAI API key.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:5000/api` by default. Set `VITE_API_URL` to override it.

## API Overview

- `POST /api/auth/register` - create an account
- `POST /api/auth/login` - sign in and receive a JWT
- `POST /api/resume/upload` - upload a PDF resume
- `GET /api/resume/latest` - fetch the latest parsed resume
- `POST /api/career/analyze` - create a career plan for a target role
- `GET /api/career/plans` - list saved career plans

## Notes

- Uploaded PDFs are parsed with `pdf-parse`.
- Skill matching uses the predefined dataset in `backend/src/data/jobSkills.json`.
- If `OPENAI_API_KEY` is missing, the backend returns deterministic fallback suggestions so the app remains usable during local development.
