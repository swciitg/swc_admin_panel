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

## Bug Reports

If you encounter any issues or bugs while using the admin panel generator, please help us improve by reporting them:

### How to Report a Bug

1. **Check Existing Issues**: Before creating a new issue, please check the [Issues page](https://github.com/swc-iitg/swc_admin_panel/issues) to see if the bug has already been reported.

2. **Create a New Issue**: If your bug is not already listed, create a new issue with the following information:
   - **Clear Title**: Summarize the bug in one line
   - **Description**: Detailed explanation of the issue
   - **Steps to Reproduce**: List the exact steps to reproduce the bug
   - **Expected Behavior**: What you expected to happen
   - **Actual Behavior**: What actually happened
   - **Environment Details**:
     - Node.js version
     - NPM/Yarn version
     - Operating System
     - MongoDB version
     - Next.js version
   - **Screenshots/Logs**: Include relevant error messages, screenshots, or logs
   - **Code Samples**: If applicable, provide minimal code to reproduce the issue

3. **Use Issue Templates**: We provide issue templates for:
   - Bug Reports
   - Feature Requests
   - Documentation Issues

### Quick Links

- [Report a Bug](https://github.com/swc-iitg/swc_admin_panel/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/swc-iitg/swc_admin_panel/issues/new?template=feature_request.md)
- [View All Issues](https://github.com/swc-iitg/swc_admin_panel/issues)

---

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

Please read our [**CONTRIBUTING.md**](CONTRIBUTING.md) guide for detailed information


## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Maintained By

**Student Web Committee, IIT Guwahati**


## Acknowledgments

Built with ❤️ by the Student Web Committee team for the IIT Guwahati community.