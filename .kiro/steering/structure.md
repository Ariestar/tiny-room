# Project Structure

## Root Directory

- `src/` - Main application source code
- `prisma/` - Database schema and migrations
- `posts/` - Static markdown blog posts
- `.kiro/` - Kiro AI assistant configuration
- `postgres_data/` - Local PostgreSQL data (Docker)

## App Router Structure (`src/app/`)

### Route Groups

- `(admin)/` - Protected admin dashboard routes
- `(dev)/` - Development and testing routes
- `(public)/` - Public-facing website routes
- `api/` - API endpoints and server actions

### Key Files

- `layout.tsx` - Root layout with providers
- `page.tsx` - Homepage
- `not-found.tsx` - 404 error page

## Components (`src/components/`)

### Organization

- `ui/` - Reusable UI components (shadcn/ui based)
- `feature/` - Feature-specific components
- `layout/` - Layout and navigation components
- `animation/` - Animation and motion components

### Component Patterns

- Use TypeScript interfaces for props
- Export components as default exports
- Co-locate component-specific types
- Use `@/` path alias for imports

## Library Code (`src/lib/`)

- Utility functions and shared logic
- Database client configuration
- Authentication helpers
- Type definitions and schemas

## Styling

- `src/styles/` - Global styles and CSS variables
- `tailwind.config.js` - Tailwind configuration with custom theme
- Component-level styling with Tailwind classes

## Database

- `prisma/schema.prisma` - Database schema
- `prisma/migrations/` - Database migration files
- Models: User, Post, Project, GalleryItem, Album

## Path Aliases

```typescript
"@/*": ["./src/*"]  // Import from src directory
```

## File Naming Conventions

- **Pages**: `page.tsx`, `layout.tsx`, `loading.tsx`
- **Components**: PascalCase (e.g., `BlogPost.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase with `.types.ts` suffix
- **API Routes**: `route.ts` in App Router

## Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal components (`@/components`)
4. Internal utilities (`@/lib`)
5. Types and interfaces
6. Relative imports

## Key Patterns

- Server Components by default
- Client Components marked with `"use client"`
- Server Actions for form handling
- Route handlers for API endpoints
- Middleware for authentication checks
