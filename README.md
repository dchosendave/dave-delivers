# Dave's Portfolio - Setup Guide

A retro terminal-style portfolio built with **Svelte 5** (frontend) and **FastAPI** (backend).

## 📋 Prerequisites

Make sure you have these installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))

Verify installations:
```powershell
node --version
npm --version
python --version
```

---

## 🚀 Quick Start

### 1. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

### 2. Install Backend Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 3. Seed the Database
```powershell
cd backend
python seed.py
```

### 4. Run the Backend
```powershell
cd backend
uvicorn app.main:app --reload
```
Backend will run at: `http://localhost:8000`

### 5. Run the Frontend (in a separate terminal)
```powershell
cd frontend
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 🎯 Available Commands in Terminal

Once the app is running, try these commands in the terminal UI:

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `about` | Information about Dave |
| `experience` | Work experience |
| `projects` | Portfolio projects |
| `skills` | Technical skills with proficiency bars |
| `contacts` | Contact information with links |
| `resume` | Download resume PDF |
| `stack` | Tech stack used for this portfolio |
| `neofetch` | Easter egg: System info (Linux-style) |
| `clear` | Clear the terminal |
| `exit` | Exit the terminal |

**Easter Eggs:** Try typing `sudo hire`, `rm -rf`, or `shutdown` 😉

---

## 📁 Project Structure

```
dave-delivers/
├── frontend/              # Svelte 5 + Vite
│   ├── src/
│   │   ├── lib/
│   │   │   └── Terminal.svelte   # Main terminal component
│   │   ├── App.svelte
│   │   ├── app.css              # CRT/retro styling
│   │   └── main.js
│   ├── public/
│   │   └── LDD - Resume January 2026 V2.pdf
│   └── package.json
│
├── backend/               # FastAPI + SQLModel
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   ├── api.py        # Routes
│   │   ├── models.py     # Database models
│   │   ├── services.py   # Command processor
│   │   └── database.py   # SQLModel setup
│   ├── seed.py           # Database seeder
│   └── requirements.txt
│
└── database/
    └── portfolio.db      # SQLite database (auto-created)
```

---

## 🎨 Features

- ✅ **Retro CRT Terminal UI** with scanlines, glow effects, and flicker animation
- ✅ **Command History** - Use ↑/↓ arrow keys to navigate previous commands
- ✅ **Live Backend Integration** - Real-time API calls to FastAPI
- ✅ **HTML Rendering** - Supports colored text, links, and formatting
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Easter Eggs** - Hidden commands for fun

---

## 🛠️ Customization

### Update Your Information

Edit the seed data in `backend/seed.py` to customize:
- Projects
- Skills & proficiency levels
- Contact information
- Work experience

Then re-run:
```powershell
python seed.py
```

### Change Colors/Styling

- **Terminal Colors**: Edit `frontend/src/lib/Terminal.svelte` (CSS section)
- **Global CRT Effects**: Edit `frontend/src/app.css`

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- **Error**: `Failed to connect to backend`
- **Solution**: Make sure the backend is running at `http://localhost:8000`

### Database errors
- **Solution**: Delete `database/portfolio.db` and run `python seed.py` again

### Port already in use
- **Frontend**: Change port in `vite.config.js`
- **Backend**: Use `uvicorn app.main:app --reload --port 8001`

---

## 🚢 Deployment

### Backend
Deploy to services like:
- **Render** (recommended for FastAPI)
- **Railway**
- **Heroku**

Update CORS origins in `backend/app/main.py` to include your frontend URL.

### Frontend
Deploy to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

Update `API_URL` in `frontend/src/lib/Terminal.svelte` to your backend URL.

---

## 📝 License

Personal portfolio project by Dave Dichoson.

---

## 🤝 Contact

- 📧 Email: lowiedave30@gmail.com
- 🐙 GitHub: [@dchosendave](https://github.com/dchosendave)
- 💼 LinkedIn: [Dave Dichoson](https://linkedin.com/in/davedichoson)
