# Portfolio Website

My personal portfolio built as a single-page application with a dark theme. I needed a way to showcase my projects to potential clients without making everything public, so I added password protection per project.

## What I Used

- HTML5 and Bootstrap 5.3.0 for the layout and styling
- Vanilla JavaScript for interactions and the password system
- Font Awesome for icons
- Google Fonts (Inter for headings, Poppins for body text)

## Main Features

The site is pretty straightforward - dark theme inspired by Next.js, fully responsive, and has smooth scrolling between sections. Each project card shows a quick overview, and clicking "View Details" brings up a modal with more information.

For the password protection, each project has its own password. Once you unlock a project, you stay authenticated for 24 hours. There's also rate limiting (3 attempts then a 5-minute lockout) to prevent brute force attempts.

The case study modals display a 6-image grid showing project screenshots, along with the tech stack and key features. Images use skeleton loading for a better UX.

## File Structure

```
portfolio-v2/
├── index.html          # Everything's in here
├── assets/
│   ├── css/
│   │   └── style.css   # Just animations and mobile menu styles
│   └── js/
│       └── script.js   # Password auth and modal logic
```

## How It Works

Just open index.html in a browser or run it through XAMPP. The navigation is self-explanatory - click around, try to view project details, and you'll hit the password modal. Each project needs its own password to unlock.

## Styling Notes

I kept this minimal by using Bootstrap utility classes for almost everything. The only custom CSS is for the floating animations and mobile menu behavior.

Color scheme:

- Primary background: #0f172a
- Secondary background: #1e293b
- Accent: #38bdf8

## Password System

The authentication is stored in sessionStorage and expires after 24 hours. Each project tracks its own authentication separately, so unlocking one doesn't unlock all of them. Failed attempts are limited to prevent spam.

---

Built this to have better control over who sees what when sharing my work with clients.
