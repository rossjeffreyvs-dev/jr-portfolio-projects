# Project Summary: AI Claude Code SP

**"Tiny missions. Big office mischief."**

This is a modern Next.js web application designed as a starter project for managing office "heists" (missions/tasks). It's a full-featured TypeScript application with authentication, dashboard management, and a clean UI.

---

## Technology Stack

### Core Framework

- **Next.js 16.0.7** with App Router and React Server Components
- **React 19.2.0** for UI components
- **TypeScript 5** with strict mode for type safety
- **Tailwind CSS 4** for utility-first styling

### Development & Testing

- **Vitest** with React Testing Library for component testing
- **ESLint 9** for code quality
- **lucide-react** for SVG icons

---

## Architecture

The project uses Next.js **App Router** with a well-organized route group structure:

### Route Groups

1. **`(public)/`** - Unauthenticated pages
   - Home page (`app/(public)/page.tsx`) - Splash/landing page
   - Login (`app/(public)/login/page.tsx`) - User authentication
   - Signup (`app/(public)/signup/page.tsx`) - User registration
   - Preview (`app/(public)/preview/page.tsx`) - Component showcase

2. **`(dashboard)/`** - Protected authenticated pages
   - Heists listing (`app/(dashboard)/heists/page.tsx`) - View all heists (active, assigned, expired)
   - Create heist (`app/(dashboard)/heists/create/page.tsx`) - Form to create new heists
   - Heist details (`app/(dashboard)/heists/[id]/page.tsx`) - Individual heist view (dynamic route)

### Component Structure

- **Navbar component** (`components/Navbar/Navbar.tsx`) - Shared navigation with branding and links
- CSS Modules for scoped component styling
- Global theme with custom CSS variables

---

## Main Features

### 1. **Heist Management System**

- Create new heists/missions
- View active heists
- Track assigned heists
- Review expired heists

### 2. **User Authentication**

- Login and signup pages
- Public vs. authenticated route separation

### 3. **Dashboard Interface**

- Clean navigation with Navbar
- Three-category heist organization
- Dynamic routing for individual heist details

### 4. **Design System**

- Custom color scheme:
  - Primary: `#C27AFF` (purple)
  - Secondary: `#FB64B6` (pink)
  - Dark: `#030712` (near-black)
- Inter font family
- Tailwind utilities + CSS modules

---

## Project Structure

```
├── app/
│   ├── (dashboard)/          # Protected routes with navbar
│   │   └── heists/           # Heist management pages
│   ├── (public)/             # Public-facing pages
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Theme & global styles
├── components/
│   └── Navbar/               # Reusable navigation component
├── tests/
│   └── components/           # Component unit tests
└── public/                   # Static assets
```

---

## Key Files

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript settings with path aliases (`@/*`)
- `vitest.config.mts` - Test runner configuration
- `globals.css` - Theme variables and Tailwind imports

---

## Testing

Unit tests are set up using Vitest with React Testing Library. Current tests cover the Navbar component (`tests/components/Navbar.test.tsx`), verifying rendering and navigation links.

---

This is a solid foundation for a task management application with modern React patterns, proper TypeScript support, and a clean separation between public and authenticated experiences!
