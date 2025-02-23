"use client";
import { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "../../components/ui/sidebar";

export default function CategoriesLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set up client-side state after mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Store sidebar state in localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isClient]);

  const handleSidebarToggle = (open) => {
    setIsSidebarCollapsed(!open);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar 
        open={!isSidebarCollapsed} 
        setOpen={handleSidebarToggle}
      >
        <SidebarBody />
      </Sidebar>
      
      <main style={{ flex: 1, padding: "2rem", fontFamily: "sans-serif" }}>
        {children}
      </main>
    </div>
  );
}