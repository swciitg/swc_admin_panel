# Admin Panel Generator for Student Web Committee, IIT Guwahati

---

## Overview

This project is an **NPM package** that generates a **Next.js admin panel** for managing MongoDB collections in an existing Node.js/Express project.  
It is designed to require **minimal user interaction**, automatically detecting models from your project and creating a read-only admin dashboard.

Key features:

- Uses **Next.js App Router** (Next 13+).
- Read-only interface for viewing MongoDB data.
- Automatically imports models from the parent project — no duplication.
- Fully customizable templates for pages, API routes, components, and styles.
- Includes authentication system for admin login.

---

## Folder Structure (Generated Admin Panel)

```
admin-panel/
│
├── app/
│ ├── layout.js
│ ├── page.js
│ ├── admin/
│ │ ├── login/page.js
│ │ └── [model]/page.js
│ └── api/
│ └── admin/
│ └── [model]/route.js
│
├── components/
│ └── TableView.js
├── lib/
│ ├── dbConnect.js
│ └── auth.js
├── config/
│ └── admin.js
└── styles/
└── globals.css
```