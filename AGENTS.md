# AGENTS.md

## Project Overview

This is the frontend for Vina, an AI homeschooling app. The AI agent acts as a virtual teacher that can teach, answer questions, and give quizzes. Users can interact by sending text, audio, and (upcoming feature) images.

## Tech Stack

- React 18 + Vite
- React Three Fiber (R3F) + Drei (3D rendering)
- LiveKit (real-time communication)
- Tailwind CSS + Framer Motion (UI/animation)

The avatar is created with ReadyPlayerMe and rendered using React Three Fiber.

## Development Environment Setup

### First-time setup:
```bash
yarn
```

### Install a new dependency:
```bash
yarn add <package-name>
```

### Run development server:
```bash
yarn dev
```

## LiveKit Integration

The room connection is established in `App.jsx` using the `livekit-client` library. It requests a token from the server at `/api/connection-details` to obtain the connection token and room URL.

## Critical Rules

❌ **DO NOT:**
- Hardcode API URLs or secrets in the frontend code
- Modify `Avatar.jsx` or `*.glb` model files
