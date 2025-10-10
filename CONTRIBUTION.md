# Contribution Guidelines for Admin Panel Generator

---
## How to Contribute
### 1. Fork the Repository
- Fork the main repository to your own GitHub account.
- Clone your fork locally:
  ```bash
  git clone <your-fork-url>
  cd <repo-folder>
  ```

### 2. Branching Strategy
Always create a new branch for your changes:
```bash
git checkout -b feature/<your-feature-name>
```
Use descriptive branch names for features, fixes, or bugs.

### 3. Code Guidelines
- Use ES6 modules (import/export) for all JS files.
- Follow consistent formatting (indentation, semicolons, quotes).
- Keep code modular: separate logic for templates, CLI, and generation scripts.
- Write clear comments for non-trivial sections.
- Ensure all changes are compatible with the Next.js App Router and MongoDB admin panel.

### 4. Testing Changes
Test CLI functionality locally:
In this repo, on your local terminal run
```bash
npm link
```
Then open the test backend folder where you want to create the admin panel and run 
```bash
npm link swc_admin_panel
cd admin-panel
npm install
```

Ensure the admin panel generates correctly in a fresh project.

Verify:
- Models are imported correctly.
- Admin login works.
- Read-only data fetch works for all models.

### 5. Submitting Changes
Commit changes with meaningful messages:
```bash
git add .
git commit -m "Feat : <description of your feature>"
// or git commit -m "Bug : <description of the bug resolved>" for bugs
```

Push your branch:
```bash
git push origin feature/<your-feature-name>
```
Create a Pull Request to the main repository.

Describe your changes clearly and mention which part of the admin panel it affects.