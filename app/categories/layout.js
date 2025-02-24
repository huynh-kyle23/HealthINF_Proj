"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "../../components/ui/sidebar";

export default function CategoriesLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
    const savedTasks = localStorage.getItem('sidebarTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const handleSidebarToggle = (open) => {
    setIsSidebarCollapsed(!open);
  };

  const handleTaskUpdate = (updatedTasks) => {
    setTasks(updatedTasks);
    console.log("Tasks updated:", updatedTasks);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar 
        open={!isSidebarCollapsed} 
        setOpen={handleSidebarToggle}
      >
        <SidebarBody tasks={tasks} onTaskUpdate={handleTaskUpdate} />
      </Sidebar>
      
      <main style={{ flex: 1, padding: "2rem", fontFamily: "sans-serif" }}>
  {React.cloneElement(children, { tasks: tasks, onTaskUpdate: handleTaskUpdate })}
</main>

    </div>
  );
}