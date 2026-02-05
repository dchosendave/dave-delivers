# CLI Admin CRUD Operations Design

> Design document for implementing CRUD operations within the custom CLI portfolio.

---

## 🎯 Approaches for CLI Admin Commands

### 1. Unix-Style Command Syntax

Use familiar patterns that developers already know and love:

```bash
# CRUD Operations
project add --name "MyApp" --desc "A cool app" --tags "python,api"
project list
project update 1 --name "New Name"
project delete 1

# Or even shorter aliases
proj add "MyApp" "Description" "python,api"
skill rm 3
exp edit 2 --company "NewCo"
```

**Why this is unique**: Developers will immediately feel at home—it's like using Git or Docker CLI.

---

### 2. Interactive Mode with Prompts

For complex operations, offer an interactive wizard:

```bash
> project add
? Project name: MyApp
? Description: A cool API
? Tags (comma-separated): python, fastapi
? URL (optional): https://github.com/...
✅ Project "MyApp" created with ID 5
```

**Why this is unique**: Shows attention to UX, similar to `npm init` or `git commit --interactive`.

---

### 3. Confirmation & Preview for Destructive Actions

```bash
> project delete 3
⚠️  You are about to delete:
   Project: "PortfolioOS" (ID: 3)
   
? Confirm deletion? [y/N]: y
🗑️  Deleted successfully.
```

---

### 4. SQL-like Query Syntax (Advanced)

For the power users:

```bash
> query skills where proficiency > 80
> query projects where tags contains "python"
```

---

### 5. Colored Output & ASCII Feedback

Make the output visually distinct for admin operations:

```bash
> skill add --name "Rust" --proficiency 65
┌──────────────────────────────────────┐
│  ✅ SKILL CREATED                    │
├──────────────────────────────────────┤
│  ID:          8                      │
│  Name:        Rust                   │
│  Proficiency: [█████████████░░░░░░░] │
└──────────────────────────────────────┘
```

---

### 6. Authentication Gate

Make it feel secure (and mysterious):

```bash
> admin
🔐 Access restricted. Enter passphrase: ****
✅ Admin mode activated.
visitor@dchosen ~/portfolio → admin@dchosen ~/portfolio #
```

The prompt changes to indicate elevated privileges.

---

### 7. Version Control & Audit Trail

```bash
> history
Last 5 operations:
  [2026-02-05 12:30] admin: project add "NewAPI"
  [2026-02-05 12:25] admin: skill update 3 --proficiency 90
  [2026-02-05 12:20] admin: contact delete 2
  
> rollback 1
⏪ Undoing last operation...
```

---

## 📋 Suggested Command Structure

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| `project` | `project add` | `project list` / `project show <id>` | `project update <id>` | `project delete <id>` |
| `skill` | `skill add` | `skill list` | `skill update <id>` | `skill delete <id>` |
| `experience` | `exp add` | `exp list` | `exp update <id>` | `exp delete <id>` |
| `contact` | `contact add` | `contact list` | `contact update <id>` | `contact delete <id>` |

---

## 🔧 Implementation Considerations

1. **Add an `admin` command** that enables/disables admin mode (stored in session state)
2. **Create a `CommandParser`** class to handle arguments like `--name`, `--desc`, etc.
3. **Extend `CommandResponse`** to support different output types (table, success, error)
4. **Keep regular commands read-only** (current behavior) and admin commands for CRUD

---

## 🗂️ Proposed File Changes

### Backend

| File | Changes |
|------|---------|
| `services.py` | Add `AdminCommandProcessor` class with CRUD methods |
| `models.py` | Add `AdminSession` model for tracking auth state |
| `api.py` | Add `/admin/auth` endpoint for session management |

### Frontend

| File | Changes |
|------|---------|
| `Terminal.svelte` | Track admin mode state, modify prompt display |

---

## 🚀 MVP Features (Phase 1)

- [ ] `admin` command to toggle admin mode
- [ ] Basic CRUD for all 4 entities (project, skill, experience, contact)
- [ ] Confirmation prompts for delete operations
- [ ] Colored success/error output

## 🔮 Future Enhancements (Phase 2)

- [ ] Interactive wizard mode for `add` commands
- [ ] `history` command with operation log
- [ ] `rollback` functionality
- [ ] SQL-like query syntax
- [ ] Export/import data commands
