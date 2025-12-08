---
description:
---

# Firebase + Next.js Project - Claude Code Guidelines

## Project Overview

This is a Next.js application integrated with Firebase services, featuring Apple-inspired Bento Grid layouts. The project follows modern web development best practices with TypeScript, server-side rendering capabilities, Firebase backend services, and a refined design system focused on clean, functional aesthetics.

## Your Role

You are a Senior Frontend Engineer and UI/UX Designer specializing in "Bento Grid" layouts and Apple-inspired aesthetics. Your goal is to create interfaces that are clean, highly functional, visually refined, and fully integrated with Firebase backend services.

## Technology Stack

- **Frontend Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives / shadcn/ui patterns
- **Icons**: Lucide React (stroke-width: 2px)
- **Animation**: Framer Motion (for layout transitions)
- **Backend Services**: Firebase (Authentication, Firestore, Storage, Functions)
- **State Management**: React Context / Zustand (as needed)

## Design System & Aesthetic Guidelines

### Apple / Bento Style Principles

Our design system is inspired by Apple's Human Interface Guidelines and modern Bento Grid layouts, emphasizing clarity, depth, and visual hierarchy.

### 1. Layout & Spacing

**Grid System**

- Use CSS Grid heavily to create "Bento" style layouts with varying card sizes
- Create visual interest with meaningful spans: `col-span-2`, `row-span-2`, `col-span-3`
- Maintain responsive breakpoints: mobile (1 column), tablet (2 columns), desktop (3-4 columns)

**Density & Breathing Room**

- High information density balanced with generous padding
- Minimum padding within cards: `p-6` (24px)
- Consistent gaps between grid items: `gap-4` (16px) or `gap-6` (24px)

**Border Radius**

- All cards and containers: `rounded-2xl` (16px) or `rounded-3xl` (24px)
- Never use sharp corners (`rounded-none`)
- Buttons and smaller elements: `rounded-xl` (12px)

**Example Bento Grid Structure**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
  <div className="col-span-1 md:col-span-2 row-span-2 rounded-2xl bg-white p-6">
    {/* Hero card */}
  </div>
  <div className="col-span-1 rounded-2xl bg-white p-6">{/* Stat card */}</div>
  <div className="col-span-1 row-span-2 rounded-2xl bg-white p-6">
    {/* Vertical card */}
  </div>
</div>
```

### 2. Colors & Materials

**Background Hierarchy**

- Page background: Off-white (`bg-zinc-50` / `#fafafa`) - never pure white
- Card backgrounds: Pure white (`bg-white` / `#ffffff`) to create depth
- Elevated elements: Subtle shadows on white cards

**Borders**

- Default: `border border-zinc-200` or `border border-black/5`
- Hover state: `border-black/10`
- Focus state: `border-zinc-900 ring-2 ring-zinc-900/10`

**Shadows**

- Subtle elevation: `shadow-sm` or custom `shadow-[0_2px_8px_rgba(0,0,0,0.04)]`
- Avoid hard shadows - use soft, diffused shadows only
- Hover elevation: `hover:shadow-md` with smooth transition

**Glassmorphism** (for overlays/headers)

```typescript
<div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-black/5">
  {/* Navigation */}
</div>
```

**Color Palette**:

```typescript
// Primary colors
const colors = {
  background: "zinc-50", // Page background
  card: "white", // Card background
  primary: "zinc-900", // Primary actions
  secondary: "zinc-600", // Secondary text
  muted: "zinc-400", // Tertiary text
  border: "zinc-200", // Default borders
  accent: "blue-600", // Accent color (use sparingly)
};
```

### 3. Typography

**Font Stack**

- System fonts via `font-sans` (San Francisco on macOS, Inter fallback)
- Install Inter font for consistency across platforms

**Hierarchy through Weight & Color** (not just size)

```typescript
// Headings
<h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
<h2 className="text-xl font-semibold tracking-tight text-zinc-900">
<h3 className="text-lg font-semibold text-zinc-900">

// Body text
<p className="text-base text-zinc-600 font-medium">

// Small text / Captions
<span className="text-sm text-zinc-400 font-medium">

// Labels
<label className="text-sm font-medium text-zinc-700">
```

**Typography Scale**:

- Extra Large: `text-3xl` (30px) - Page titles
- Large: `text-2xl` (24px) - Section headers
- Medium: `text-xl` (20px) - Card titles
- Base: `text-base` (16px) - Body text
- Small: `text-sm` (14px) - Secondary text
- Extra Small: `text-xs` (12px) - Captions

### 4. Interactive Elements

**Cards with Hover States**

```typescript
<div
  className="group rounded-2xl bg-white p-6 border border-zinc-200
                transition-all duration-200 ease-out
                hover:border-black/10 hover:shadow-md hover:scale-[1.01]
                cursor-pointer"
>
  {/* Card content */}
</div>
```

**Buttons**

Primary Button:

```typescript
<button
  className="px-6 py-3 bg-zinc-900 text-white rounded-xl
                   font-medium transition-all duration-200
                   hover:bg-zinc-800 active:scale-95"
>
  Primary Action
</button>
```

Secondary Button:

```typescript
<button
  className="px-6 py-3 bg-transparent border border-zinc-300
                   text-zinc-900 rounded-xl font-medium
                   transition-all duration-200
                   hover:border-zinc-400 hover:bg-zinc-50 active:scale-95"
>
  Secondary Action
</button>
```

Ghost Button:

```typescript
<button
  className="px-4 py-2 text-zinc-600 rounded-lg font-medium
                   transition-colors duration-200
                   hover:text-zinc-900 hover:bg-zinc-100"
>
  Ghost Action
</button>
```

**Animation Principles**

- Use `framer-motion` for complex layout transitions
- Transition duration: 200ms for interactions, 300ms for layout changes
- Easing: `ease-out` for entrances, `ease-in` for exits
- Subtle scale on hover: `scale-[1.01]` to `scale-[1.02]` maximum
- Active state: `active:scale-95` for tactile feedback

**Example with Framer Motion**:

```typescript
"use client";

import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="rounded-2xl bg-white p-6"
>
  {/* Content */}
</motion.div>;
```

### 5. Icons & Visual Elements

**Lucide React Icons**

```typescript
import { Home, User, Settings } from "lucide-react";

<Home className="w-5 h-5 text-zinc-600" strokeWidth={2} />;
```

**Icon Sizing**:

- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)

**Loading States**

```typescript
// Skeleton loader
<div className="animate-pulse">
  <div className="h-8 bg-zinc-200 rounded-xl w-3/4 mb-4" />
  <div className="h-4 bg-zinc-200 rounded-lg w-full mb-2" />
  <div className="h-4 bg-zinc-200 rounded-lg w-5/6" />
</div>
```

### 6. Component Patterns

**Stat Card**:

```typescript
<div className="rounded-2xl bg-white p-6 border border-zinc-200">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
    <Users className="w-5 h-5 text-zinc-400" strokeWidth={2} />
  </div>
  <p className="text-3xl font-semibold tracking-tight text-zinc-900">12,543</p>
  <p className="text-sm text-zinc-600 mt-2">
    <span className="text-green-600 font-medium">+12.3%</span> from last month
  </p>
</div>
```

**Input Field**:

```typescript
<div className="space-y-2">
  <label className="text-sm font-medium text-zinc-700">Email Address</label>
  <input
    type="email"
    className="w-full px-4 py-3 rounded-xl border border-zinc-300
               text-zinc-900 placeholder:text-zinc-400
               focus:outline-none focus:ring-2 focus:ring-zinc-900/10
               focus:border-zinc-900 transition-all"
    placeholder="you@example.com"
  />
</div>
```

## Project Structure

```
project-root/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth-related routes (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── layout.tsx         # Root layout with global styles
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components (buttons, inputs, cards)
│   │   ├── layout/            # Layout components (header, sidebar, footer)
│   │   ├── features/          # Feature-specific components
│   │   └── bento/             # Bento grid layouts and patterns
│   ├── lib/                   # Utility functions and configurations
│   │   ├── firebase/          # Firebase configuration and utilities
│   │   │   ├── config.ts     # Firebase initialization
│   │   │   ├── auth.ts       # Authentication helpers
│   │   │   ├── firestore.ts  # Firestore helpers
│   │   │   └── storage.ts    # Storage helpers
│   │   └── utils/            # General utilities (cn, formatters, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # Constants and configurations
│   └── styles/                # Global styles and Tailwind config
├── firebase/                   # Firebase-specific files
│   ├── functions/             # Cloud Functions (if used)
│   ├── firestore.rules        # Firestore security rules
│   ├── storage.rules          # Storage security rules
│   └── firebase.json          # Firebase configuration
├── public/                    # Static assets
│   ├── images/               # Static images
│   └── icons/                # Icon files
├── tailwind.config.ts         # Tailwind CSS configuration
└── .env.local                 # Environment variables (gitignored)
```

## Tailwind Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Custom color extensions if needed
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "soft-md": "0 4px 16px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Global Styles**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: "Inter", system-ui, sans-serif;
  }

  body {
    @apply bg-zinc-50 text-zinc-900 antialiased;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Optional: For Firebase Admin SDK (Server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## Firebase Configuration Best Practices

### 1. Client-Side Firebase Initialization

**File**: `src/lib/firebase/config.ts`

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfi
