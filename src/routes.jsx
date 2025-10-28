import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import App from "./App";
import { NavigationBar } from "./components/NavigationBar";

// Lazy load AI Agent page for code splitting
const AiAgentPage = lazy(() => import("./pages/ai-agent/AiAgentPage"));

// Root route - renders navigation and an outlet for child routes
const rootRoute = createRootRoute({
  component: () => (
    <div className="h-screen w-screen">
      <NavigationBar />
      <Outlet />
    </div>
  ),
});

// Index route - the avatar experience
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

// AI Agent chat route - lazy loaded
const aiAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-agent",
  component: () => (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading AI Agent...
            </p>
          </div>
        </div>
      }
    >
      <AiAgentPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, aiAgentRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});
