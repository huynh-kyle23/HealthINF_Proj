"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "../../components/ui/sidebar";
import {AnimatedCircularProgressBar} from "../../components/magicui/animated-circular-progress-bar";

export default function CategoriesLayout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [value, setValue] = useState(0);
  
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
  
    useEffect(() => {
      const handleIncrement = (prev) => {
        if (prev === 100) {
          return 0;
        }
        return prev + 10;
      };
      setValue(handleIncrement);
      const interval = setInterval(() => setValue(handleIncrement), 2000);
      return () => clearInterval(interval);
    }, []);
  
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
        
        <main style={{ flex: 1, padding: "2rem", fontFamily: "sans-serif", position: "relative" }}>
          <div className="absolute top-4 right-4 z-20">
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={value}
              gaugePrimaryColor="rgb(79 70 229)"
              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            />
          </div>
          {React.cloneElement(children, { tasks: tasks, onTaskUpdate: handleTaskUpdate })}
        </main>
      </div>
    );
  }