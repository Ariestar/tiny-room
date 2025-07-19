# Technology Stack

## Core Framework

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with server components
- **TypeScript** - Type-safe JavaScript

## Database & ORM

- **PostgreSQL** - Primary database
- **Prisma** - Database ORM and migrations
- **Docker Compose** - Local database setup

## Authentication

- **NextAuth.js 5.0** - Authentication with GitHub OAuth
- **JWT Strategy** - Session management

## Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Content & Markdown

- **MDX** - Markdown with React components
- **Remark/Rehype** - Markdown processing pipeline
- **KaTeX** - Math equation rendering
- **Mermaid** - Diagram rendering
- **Shiki** - Syntax highlighting

## File Storage

- **AWS S3/Cloudflare R2** - Image and file storage
- **Pre-signed URLs** - Secure file uploads

## Package Management

- **pnpm** - Fast, disk space efficient package manager

## Common Commands

### Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database

```bash
pnpm db:migrate       # Run Prisma migrations
npx prisma generate   # Generate Prisma client
npx prisma studio     # Open Prisma Studio
npx prisma db push    # Push schema changes
```

### Docker

```bash
docker-compose up -d  # Start PostgreSQL database
docker-compose down   # Stop database
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_ID` - GitHub OAuth client ID
- `GITHUB_SECRET` - GitHub OAuth client secret
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `R2_*` - Cloudflare R2 storage configuration
