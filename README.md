# Dave's Portfolio - Full-Stack SvelteKit

A retro terminal-style portfolio built with **SvelteKit** (full-stack TypeScript) and **Turso** (cloud SQLite database).

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))

Verify installation:
```powershell
node --version
npm --version
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Set Up Environment Variables

Copy the example file and configure for local development:
```powershell
cp .env.example .env
```

The default `.env` uses your local SQLite database:
```bash
TURSO_DB_URL=file:../database/portfolio.db
TURSO_DB_AUTH_TOKEN=
```

### 3. Run the Development Server
```powershell
npm run dev
```

The app will run at: **`http://localhost:5173`**

That's it! The database will initialize automatically on first run.

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
├── frontend/              # Full-stack SvelteKit app
│   ├── src/
│   │   ├── lib/
│   │   │   ├── server/           # Server-only code
│   │   │   │   ├── db/           # Database connection & models
│   │   │   │   ├── repositories/ # Data access layer
│   │   │   │   └── services/     # Business logic
│   │   │   ├── Terminal.svelte
│   │   │   └── portfolio/        # Portfolio components
│   │   ├── routes/
│   │   │   ├── api/              # API endpoints
│   │   │   │   ├── execute/+server.ts
│   │   │   │   ├── projects/+server.ts
│   │   │   │   └── ...
│   │   │   ├── desktop/          # Desktop view
│   │   │   └── +page.svelte
│   │   ├── hooks.server.ts       # Server initialization
│   │   └── app.css               # CRT/retro styling
│   ├── static/
│   │   └── public/
│   │       └── LDD - Resume January 2026 V2.pdf
│   ├── .env                      # Environment variables
│   ├── TURSO_SETUP.md            # Production deployment guide
│   └── package.json
│
└── database/
    └── portfolio.db              # SQLite database (local dev)
```

---

## 🎨 Features

- ✅ **Retro CRT Terminal UI** with scanlines, glow effects, and flicker animation
- ✅ **Command History** - Use ↑/↓ arrow keys to navigate previous commands
- ✅ **Full-Stack TypeScript** - Type safety across frontend & backend
- ✅ **Raw SQL Queries** - Direct database control with Turso client
- ✅ **HTML Rendering** - Supports colored text, links, and formatting
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Easter Eggs** - Hidden commands for fun
- ✅ **Serverless Ready** - Deploy to Vercel with Turso cloud database

---

## 🛠️ Customization

### Update Your Information

The database is seeded from the existing `database/portfolio.db` file. To customize:

**Option 1: Edit SQLite directly**
```powershell
# Use a SQLite browser (DB Browser for SQLite recommended)
# Open: database/portfolio.db
# Edit tables: project, skill, contact, experience
```

**Option 2: Create a TypeScript seed script**

See `TURSO_SETUP.md` for instructions on creating a seed script.

### Change Colors/Styling

- **Terminal Colors**: Edit `frontend/src/lib/Terminal.svelte` (CSS section)
- **Global CRT Effects**: Edit `frontend/src/app.css`

---

## 🐛 Troubleshooting

### Database errors
- **Solution**: Delete `database/portfolio.db` and the application will recreate tables on next startup
- Check console for: `✅ Database initialized successfully`

### Port already in use
- **Solution**: Change port in `vite.config.js` or stop other Vite servers

### Environment variable errors
- **Solution**: Make sure `.env` file exists in `frontend/` directory
- Verify `TURSO_DB_URL` is set (default: `file:../database/portfolio.db`)

---

## 🚢 Production Deployment

### Deploy to Vercel (Recommended)

**Prerequisites:**
1. Set up Turso cloud database (see `TURSO_SETUP.md`)
2. Get Turso connection URL and auth token

**Steps:**

1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Root directory: `frontend`

3. **Add Environment Variables**
   In Vercel dashboard, add:
   - `TURSO_DB_URL` = `libsql://yourdb.turso.io`
   - `TURSO_DB_AUTH_TOKEN` = your token

4. **Deploy!**

See `frontend/TURSO_SETUP.md` for detailed Turso setup instructions.

---

## 🏗️ Technology Stack

**Frontend:**
- Svelte 5 (Runes mode)
- Vite
- TypeScript (strict mode)
- CSS3 (CRT effects)

**Backend:**
- SvelteKit (server routes)
- TypeScript
- Zod (runtime validation)

**Database:**
- Turso (cloud SQLite for production)
- Local SQLite file (development)
- `@libsql/client` (database driver)

**Deployment:**
- Vercel (frontend + API)
- Turso (database)

---

## 📝 License

Personal portfolio project by Dave Dichoson.

---

## 🤝 Contact

- 📧 Email: lowiedave30@gmail.com
- 🐙 GitHub: [@dchosendave](https://github.com/dchosendave)
- 💼 LinkedIn: [Dave Dichoson](https://linkedin.com/in/davedichoson)

---

## 📚 Additional Documentation

- **Turso Setup Guide**: See `frontend/TURSO_SETUP.md`
- **API Documentation**: All endpoints are in `frontend/src/routes/api/`
- **Migration Guide**: Full migration walkthrough available in project artifacts
