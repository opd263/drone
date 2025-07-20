// apps/web/src/app/layout.tsx
import '../globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex justify-center">
          <div className="max-w-5xl w-full p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
