# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `npm start` or `ng serve` (runs on http://localhost:4200)
- **Build**: `npm run build` or `ng build` (outputs to `dist/`)
- **Test**: `npm test` or `ng test` (runs Karma/Jasmine tests)
- **Watch build**: `npm run watch` or `ng build --watch --configuration development`

## Project Architecture

This is an Angular 20 application using a modular architecture pattern with apps/modules structure:

### Core Structure
- **Main app**: Located in `src/app/` with zoneless change detection enabled
- **Admin Panel**: Primary application module in `src/app/apps/admin-panel/`
- **Routing**: Uses lazy-loaded modules with route generation functions

### Module Organization
Each module follows a consistent structure:
```
modules/[module-name]/
  ├── components/
  ├── config/
  │   ├── [module].providers.ts
  │   └── [module].routes.ts
  ├── features/
  │   └── [feature-name]/
  │       ├── components/
  │       ├── pages/
  │       ├── services/
  │       └── types/
  ├── guards/
  ├── services/
  └── types/
```

### Key Modules
- **Auth Module**: Handles authentication with guards (authGuard, authChildGuard, guestGuard)
- **Users Module**: User management functionality
- **Core**: Shared layout components and navigation services

### Authentication Flow
- Uses route guards to protect authenticated routes
- Guest guard prevents authenticated users from accessing auth pages
- Auth service with mock implementation for development

### Technology Stack
- Angular 20 with Angular Material
- TailwindCSS for styling
- SCSS for component styles
- RxJS for reactive programming
- Karma/Jasmine for testing

### Service Pattern
Services follow interface/implementation pattern:
- Interface definitions in `[service].interface.ts`
- Mock implementations for development
- Index file for clean imports

### Route Generation
Uses dynamic route generation functions (`generateAdminPanelRoutes()`, `generateUsersModuleRoutes()`) allowing for configuration-based routing.