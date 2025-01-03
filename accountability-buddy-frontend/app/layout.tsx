// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>Accountability Buddy</title>
      </head>
      <body className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen flex flex-col">
        {/* Header with Navigation */}
        <header className="bg-white shadow-md py-4">
          <nav className="container mx-auto px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Accountability Buddy
              </Link>
            </h1>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-200 py-4 mt-8">
          <div className="container mx-auto px-6 text-center">
            <p>© {new Date().getFullYear()} Accountability Buddy. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
