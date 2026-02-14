# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 portfolio/heist management application with TypeScript, React 19, and Tailwind CSS 4. The app uses App Router with route groups to separate public pages from authenticated dashboard pages.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a single test file
npm test -- path/to/test.test.tsx
```

## Architecture

### Route Groups Structure

The app uses Next.js App Router with **route groups** to organize pages:

- **`(public)/`** - Unauthenticated pages with basic layout
  - Uses `app/(public)/layout.tsx` which wraps content in `<main className="public">`
  - Routes: `/` (home), `/login`, `/signup`, `/preview`

- **`(dashboard)/`** - Protected pages with Navbar
  - Uses `app/(dashboard)/layout.tsx` which includes the `<Navbar>` component
  - Routes: `/heists`, `/heists/create`, `/heists/[id]`

**Important:** Route groups use parentheses `()` and don't affect the URL path. The folder name `(public)` or `(dashboard)` is purely organizational.

### Layout Hierarchy

1. **Root Layout** (`app/layout.tsx`)
   - Defines `<html>` and `<body>` tags
   - Imports global CSS from `app/globals.css`
   - Sets metadata (title, description)

2. **Route Group Layouts**
   - Public layout adds minimal wrapper
   - Dashboard layout adds `<Navbar>` for navigation

### Component Organization

Components follow a module structure:

- Each component has its own directory (e.g., `components/Navbar/`)
- Contains: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts` (barrel export)
- Import using barrel: `import Navbar from "@/components/Navbar"`

### Styling System

- **Tailwind CSS 4** with `@theme` directive in `globals.css`
- **CSS Modules** for component-specific styles (scoped with `.module.css`)
- **Custom theme colors** defined in `globals.css`:
  - `--color-primary`: #C27AFF (purple)
  - `--color-secondary`: #FB64B6 (pink)
  - `--color-dark`: #030712 (background)
  - `--color-success`: #05DF72 (green)
  - `--color-error`: #FF6467 (red)
- Utility classes available: `.page-content`, `.center-content`, `.form-title`

### Path Aliases

TypeScript is configured with `@/*` pointing to project root:

```typescript
import Component from "@/components/Component";
import { util } from "@/utils/util";
```

## Testing

- **Framework:** Vitest with React Testing Library
- **Configuration:** `vitest.config.mts` with jsdom environment
- **Setup:** Global test setup in `vitest.setup.ts`
- Tests use globals (no need to import `describe`, `it`, `expect`)
- Component tests located in `tests/components/`

## Key Technical Details

- **React Server Components** are the default (use `"use client"` directive when needed)
- **TypeScript strict mode** is enabled
- **Next.js 16** uses React 19 Server Components architecture
- Font: Inter (loaded via Google Fonts in `globals.css`)
- Icons: lucide-react library
