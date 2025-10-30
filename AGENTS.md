# AGENTS.md

## Project Overview

This is the frontend for Vina, an AI homeschooling app. The AI agent acts as a virtual teacher that can teach, answer questions, and give quizzes. Users can interact by sending text, audio, and (upcoming feature) images.

## Tech Stack

- React 18 + Vite + TypeScript
- React Three Fiber (R3F) + Drei (3D rendering)
- LiveKit (real-time communication)
- Tailwind CSS + Framer Motion (UI/animation)
- pnpm (package manager)

The avatar is created with ReadyPlayerMe and rendered using React Three Fiber.

## Development Environment Setup

### First-time setup:
```bash
pnpm install
```

### Install a new dependency:
```bash
pnpm add <package-name>
```

### Run development server:
```bash
pnpm dev
```

### Run type checking:
```bash
pnpm typecheck
```

## TypeScript Migration (October 2025)

The project has been migrated to TypeScript with the following:
- Incremental migration support (`allowJs: true`)
- Path alias: `@/*` maps to `src/*`
- Type definitions in `src/types/`
- Asset module declarations in `src/global.d.ts`

All files have been converted to TypeScript except `Avatar.jsx` (per critical rules below).

## LiveKit Integration

The room connection is established in `App.tsx` using the `livekit-client` library. It requests a token from the server at `/api/connection-details` to obtain the connection token and room URL.

## Critical Rules

❌ **DO NOT:**
- Hardcode API URLs or secrets in the frontend code
- Modify `Avatar.jsx` or `*.glb` model files
