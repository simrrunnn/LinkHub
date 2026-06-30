# Links Manager

A Pinterest-inspired link management application that lets you save, organize, and browse links in visual boards — with a Chrome extension for saving links directly from any webpage via right-click.

---

## Features

- Save links into visual boards (a link can belong to multiple boards)
- Auto-fetch link metadata: title, description, and Open Graph image on save
- Pinterest-style masonry card layout
- Chrome extension with right-click context menu — no copy-pasting URLs
- Local-first: runs entirely on your machine, no internet account needed

---

## Architecture Overview

The app is made up of three independent pieces that talk to each other:

```
┌─────────────────────┐         ┌──────────────────────────┐
│   Chrome Extension  │──POST──▶│                          │
│  (right-click menu) │         │   Backend API            │
└─────────────────────┘         │   Node.js + Express      │
                                │   localhost:3001         │
┌─────────────────────┐         │                          │
│   React Frontend    │◀──GET──▶│   Prisma ORM             │
│   localhost:5173    │         │        │                 │
└─────────────────────┘         │        ▼                 │
                                │   PostgreSQL DB          │
                                │   (links_manager)        │
                                └──────────────────────────┘
```

