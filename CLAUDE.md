# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production (runs prisma generate first)
pnpm typecheck        # Run TypeScript type checking
pnpm test             # Run Jest tests
pnpm test -- --testPathPattern="ファイル名"  # 特定のテストを実行
```

### Prisma Commands

```bash
npx prisma format     # Format schema file
npx prisma generate   # Generate types from schema
npx prisma db push    # Push schema changes to MongoDB
npx prisma studio     # Open database GUI
```

### Lint & Format

```bash
npx eslint app/              # ESLint チェック
npx prettier --check app/    # Prettier フォーマットチェック
npx prettier --write app/    # Prettier 自動フォーマット
```

## Architecture

This is a shared expense tracking (ledger) application built with Remix, deployed to Vercel.

### Tech Stack
- **Remix** v1.17 with Vercel adapter
- **Mantine** v6 for UI components
- **Tailwind CSS** for utility styling
- **Prisma** with MongoDB
- **dayjs** for date handling
- **remix-typedjson** for type-safe loader/action data

### Route Structure

Uses Remix v2 flat routes with `_layout` prefix for authenticated routes:

```
app/routes/
├── _layout.tsx                              # Main layout shell (handles login)
├── _layout._index.tsx                       # Dashboard
├── _layout.payment._index.($date).tsx       # Group payment list (optional date param)
├── _layout.payment.create.tsx               # Create group payment
├── _layout.payment.edit.$id.tsx             # Edit group payment
├── _layout.user.$userId.($date)._index.tsx  # User's payment history
├── _layout.user.$userId.create.tsx          # User creates payment
├── _layout.toBuy._index.tsx                 # Shopping list
└── _layout.logout.tsx                       # Logout
```

### Data Layer

**Models** (`app/models/*.server.ts`): Prisma query functions for each entity
- `payment.server.ts` - Group expense CRUD
- `user.server.ts` - User CRUD
- `tobuy.server.ts` - Shopping list CRUD

**Database** (`prisma/schema.prisma`): MongoDB with 4 models
- `User` - Users with icon and timestamps
- `Payment` - Shared group expenses with `payPer` (percentage split)
- `UserPayment` - Individual user expenses
- `ToBuy` - Shopping list items

### Key Patterns

**Type-safe data passing**: Use `typedjson()` in loaders and `useTypedLoaderData<typeof loader>()` in components

**Cookie-based auth**: Simple session via `cookie.server.ts`, login password hashed with SHA-256

**Date filtering**: Routes accept optional `($date)` param for month-based views, utilities in `app/utils/date/`

**Path alias**: `~/*` maps to `./app/*`
