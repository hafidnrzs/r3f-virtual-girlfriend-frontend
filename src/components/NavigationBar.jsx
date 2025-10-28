import { Link } from "@tanstack/react-router";

export function NavigationBar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 px-3 py-2">
        <Link
          to="/"
          activeProps={{
            className:
              "px-3 py-1.5 text-sm font-medium rounded transition-colors bg-blue-500 text-white",
          }}
          inactiveProps={{
            className:
              "px-3 py-1.5 text-sm font-medium rounded transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
          }}
        >
          Avatar
        </Link>
        <Link
          to="/ai-agent"
          activeProps={{
            className:
              "px-3 py-1.5 text-sm font-medium rounded transition-colors bg-blue-500 text-white",
          }}
          inactiveProps={{
            className:
              "px-3 py-1.5 text-sm font-medium rounded transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
          }}
        >
          AI Chat
        </Link>
      </div>
    </nav>
  );
}
