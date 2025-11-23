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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### 2. Server-Side Firebase Admin SDK

**File**: `src/lib/firebase/admin.ts`

```typescript
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin only on server-side
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
```

### 3. Authentication Patterns

**Custom Hook**: `src/hooks/useAuth.ts`

```typescript
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

## Next.js Specific Best Practices

### 1. Server Components vs Client Components

- **Use Server Components by default** for better performance
- **Use Client Components** only when you need:
  - Browser APIs (localStorage, window, etc.)
  - Event handlers (onClick, onChange, etc.)
  - State management (useState, useReducer, etc.)
  - Firebase client SDK operations

**Example Client Component**:

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.email}</div>;
}
```

### 2. Server Actions for Mutations

Use Server Actions for data mutations to improve security and performance:

**File**: `src/app/actions/user.ts`

```typescript
"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: string, data: any) {
  try {
    await adminDb.collection("users").doc(userId).update(data);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}
```

### 3. Route Protection

**Middleware**: `src/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check authentication status via cookies or custom token
  const token = request.cookies.get("session");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

## Firebase Best Practices

### 1. Firestore Queries

**Efficient Query Pattern**:

```typescript
// ❌ BAD: Loading entire collection
const snapshot = await getDocs(collection(db, "users"));

// ✅ GOOD: Using queries with limits
const q = query(
  collection(db, "users"),
  where("status", "==", "active"),
  orderBy("createdAt", "desc"),
  limit(20)
);
const snapshot = await getDocs(q);
```

### 2. Real-time Listeners Management

Always unsubscribe from listeners:

```typescript
useEffect(() => {
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messages);
  });

  return () => unsubscribe(); // Cleanup
}, []);
```

### 3. Batch Operations

Use batch writes for multiple operations:

```typescript
import { writeBatch, doc } from "firebase/firestore";

const batch = writeBatch(db);

// Add multiple operations
batch.set(doc(db, "users", "user1"), { name: "User 1" });
batch.update(doc(db, "users", "user2"), { status: "active" });
batch.delete(doc(db, "users", "user3"));

// Commit all operations together
await batch.commit();
```

### 4. Security Rules

**Firestore Rules** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function for authentication
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function for authorization
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Public data
    match /public/{document=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

## Performance Optimization

### 1. Code Splitting

Use dynamic imports for heavy components:

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if component uses browser APIs
});
```

### 2. Image Optimization

Always use Next.js Image component:

```typescript
import Image from "next/image";

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority // For above-the-fold images
/>;
```

### 3. Caching Strategy

Use Next.js caching for Firebase data:

```typescript
// App Router - with revalidation
export const revalidate = 3600; // Revalidate every hour

async function getData() {
  const snapshot = await getDocs(collection(db, "posts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
```

## Error Handling

### Consistent Error Handling Pattern

```typescript
import { FirebaseError } from "firebase/app";

export function handleFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/user-not-found":
        return "User not found";
      case "auth/wrong-password":
        return "Incorrect password";
      case "permission-denied":
        return "You do not have permission to perform this action";
      default:
        return error.message;
    }
  }
  return "An unexpected error occurred";
}
```

## Testing Guidelines

### 1. Unit Tests

Test utilities and pure functions:

```typescript
// src/lib/utils/formatters.test.ts
import { formatDate } from "./formatters";

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-01-01");
    expect(formatDate(date)).toBe("January 1, 2024");
  });
});
```

### 2. Integration Tests

Use Firebase Emulator for testing:

```json
// firebase.json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true
    }
  }
}
```

## Common Pitfalls to Avoid

1. **❌ Don't fetch data in Client Components when it can be done in Server Components**
2. **❌ Don't expose Firebase Admin credentials in client-side code**
3. **❌ Don't forget to add indexes for complex Firestore queries**
4. **❌ Don't use synchronous methods that block the main thread**
5. **❌ Don't forget to handle loading and error states**
6. **❌ Don't store sensitive data in Firestore without proper security rules**
7. **❌ Don't use real-time listeners when one-time reads are sufficient**

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start Firebase emulators (for local development)
firebase emulators:start

# Start Next.js dev server
npm run dev
```

### Deployment Checklist

- [ ] Environment variables configured in production
- [ ] Firebase security rules tested and deployed
- [ ] Firebase indexes created for all queries
- [ ] Next.js build successful with no errors
- [ ] Performance metrics checked (Lighthouse)
- [ ] Error tracking configured (e.g., Sentry)

## Useful Commands

```bash
# Firebase
firebase login
firebase init
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase emulators:start

# Next.js
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Type checking
npx tsc --noEmit     # Check TypeScript errors
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase with Next.js Guide](https://firebase.google.com/docs/web/setup#next.js)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Lucide Icons](https://lucide.dev)
- [Framer Motion](https://www.framer.com/motion/)

## Complete Example: Dashboard with Firebase Integration

Here's a complete example that demonstrates the integration of our design system with Firebase:

**File**: `src/app/dashboard/page.tsx`

```typescript
import { Suspense } from "react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UserGreeting } from "@/components/dashboard/UserGreeting";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header with glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Suspense fallback={<UserGreetingSkeleton />}>
          <UserGreeting />
        </Suspense>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Suspense fallback={<StatsGridSkeleton />}>
            <StatsGrid />
          </Suspense>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// Skeleton components
function UserGreetingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-zinc-200 rounded-xl w-64" />
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-6 border border-zinc-200"
        >
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-zinc-200 rounded-lg w-24" />
            <div className="h-8 bg-zinc-200 rounded-xl w-32" />
            <div className="h-3 bg-zinc-200 rounded-lg w-full" />
          </div>
        </div>
      ))}
    </>
  );
}

function ActivitySkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-zinc-200">
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 rounded-lg w-3/4" />
              <div className="h-3 bg-zinc-200 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File**: `src/components/dashboard/StatsGrid.tsx`

```typescript
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { getStats } from "@/lib/firebase/stats";

export async function StatsGrid() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12.3%",
      icon: Users,
      trend: "up",
      span: "col-span-1",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+8.2%",
      icon: DollarSign,
      trend: "up",
      span: "col-span-1",
    },
    {
      title: "Orders",
      value: stats.orders.toLocaleString(),
      change: "-2.4%",
      icon: ShoppingCart,
      trend: "down",
      span: "col-span-1",
    },
    {
      title: "Growth",
      value: `${stats.growth}%`,
      change: "+15.3%",
      icon: TrendingUp,
      trend: "up",
      span: "col-span-1",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.span} rounded-2xl bg-white p-6 border border-zinc-200 
                     transition-all duration-200 ease-out
                     hover:border-black/10 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400">{card.title}</h3>
            <card.icon className="w-5 h-5 text-zinc-400" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-zinc-900">
            {card.value}
          </p>
          <p className="text-sm text-zinc-600 mt-2">
            <span
              className={`font-medium ${
                card.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {card.change}
            </span>{" "}
            from last month
          </p>
        </div>
      ))}
    </>
  );
}
```

**File**: `src/components/dashboard/UserGreeting.tsx`

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export function UserGreeting() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-200 rounded-xl w-64" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-xl font-semibold text-zinc-900">
        Welcome to your Dashboard
      </div>
    );
  }

  const greeting = getGreeting();
  const displayName = user.displayName || user.email?.split("@")[0] || "there";

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">
        {greeting}, {displayName}
      </h2>
      <p className="text-sm text-zinc-600 mt-1">
        Here's what's happening with your business today
      </p>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
```

**File**: `src/lib/firebase/stats.ts`

```typescript
import { adminDb } from "./admin";
import { unstable_cache } from "next/cache";

export const getStats = unstable_cache(
  async () => {
    const usersSnapshot = await adminDb.collection("users").count().get();
    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("status", "==", "completed")
      .count()
      .get();

    // Calculate revenue from orders
    const ordersQuery = await adminDb
      .collection("orders")
      .where("status", "==", "completed")
      .get();

    const revenue = ordersQuery.docs.reduce((sum, doc) => {
      return sum + (doc.data().total || 0);
    }, 0);

    return {
      totalUsers: usersSnapshot.data().count,
      orders: ordersSnapshot.data().count,
      revenue: revenue,
      growth: 23.5, // Calculate based on historical data
    };
  },
  ["dashboard-stats"],
  {
    revalidate: 300, // Cache for 5 minutes
  }
);
```

This example demonstrates:

- ✅ Proper use of Server Components for data fetching
- ✅ Bento Grid layout with Apple-inspired design
- ✅ Consistent design system (colors, spacing, typography)
- ✅ Firebase integration with caching
- ✅ Skeleton loaders with proper styling
- ✅ Hover effects and smooth transitions
- ✅ Client Component only where necessary (auth state)
- ✅ Proper TypeScript types
- ✅ Accessible and semantic HTML

## Notes for Claude Code

When working on this project, please:

### Technical Requirements

1. **Always check if a component should be a Server or Client Component** before adding 'use client'
2. **Use TypeScript** for all new files with proper type definitions
3. **Follow the established project structure** when creating new files
4. **Consider security implications** when working with Firebase operations
5. **Optimize for performance** by using appropriate Next.js features (Image, dynamic imports, etc.)
6. **Handle errors gracefully** with user-friendly messages
7. **Write reusable utilities** for common Firebase operations
8. **Keep security rules synchronized** with application requirements
9. **Test with Firebase Emulator** before deploying changes
10. **Document complex logic** with clear comments

### Design System Requirements

1. **Never use pure white backgrounds** for the page - always use `bg-zinc-50`
2. **Always use rounded corners** - prefer `rounded-2xl` or `rounded-3xl` for cards
3. **Use CSS Grid for Bento layouts** - vary card sizes with `col-span` and `row-span`
4. **Apply subtle hover effects** to all interactive elements (`hover:scale-[1.01]`, `hover:shadow-md`)
5. **Use system fonts** via `font-sans` with proper weight hierarchy
6. **Maintain consistent spacing** - minimum `p-6` for card padding, `gap-6` for grids
7. **Use Lucide React icons** with `strokeWidth={2}` for visual consistency
8. **Prioritize Radix UI / shadcn/ui** for accessible component primitives
9. **Apply soft shadows** only - never use hard or dark shadows
10. **Use `framer-motion`** for smooth layout transitions when needed

### Code Generation Rules

1. Always prefer Flexbox and Grid for layouts (never use floats or absolute positioning unless necessary)
2. Do not use default HTML styling - always apply Tailwind classes
3. Keep components small and modular (single responsibility principle)
4. When creating Bento Grids, ensure visual interest through varying sizes
5. All interactive elements must have hover, focus, and active states
6. Loading and error states must be designed with the same aesthetic quality
7. Ensure proper TypeScript types for all props and function parameters
8. Write semantic HTML with proper accessibility attributes

### Firebase Integration with Design System

- **Loading states**: Use skeleton loaders with `bg-zinc-200` and `animate-pulse`
- **Error states**: Show errors in elegant cards with appropriate icons
- **Authentication UI**: Follow the button and input patterns defined above
- **Real-time data**: Use smooth transitions when data updates
- **Empty states**: Design beautiful empty states with illustrations or icons

---

**Last Updated**: 2024-11-23
**Project Maintainer**: Tom
