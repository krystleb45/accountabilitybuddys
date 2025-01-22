import React from "react";
import Header from "./Header"; // Header component
import Footer from "../Footer/Footer"; // Footer component
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode; // Content to render within the layout
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer} data-testid="layout-container">
      {/* Header Component */}
      <Header isAuthenticated={false} onLogout={function (): void {
              throw new Error("Function not implemented.");
          } } />

      {/* Main Content Area */}
      <main className={styles.mainContent} role="main" aria-label="Main Content">
        {children}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Layout;
