"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "../../components/ui/sidebar";
import {AnimatedCircularProgressBar} from "../../components/magicui/animated-circular-progress-bar";

export default function CategoriesLayout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [value, setValue] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
    useEffect(() => {
      setIsClient(true);
      const saved = localStorage.getItem('sidebarCollapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(JSON.parse(saved));
      }
      const savedTasks = localStorage.getItem('sidebarTasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        
        // Initialize progress values if tasks exist
        if (parsedTasks.length > 0) {
          const task = parsedTasks[0];
          const total = (parseInt(task.duration.hours || 0) * 60 + parseInt(task.duration.minutes || 0)) * 60;
          const elapsed = parseInt(task.elapsedTime || 0);
          
          setTotalSeconds(total);
          setElapsedSeconds(elapsed);
          updateProgressValue(total, elapsed);
        }
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
  
    const updateProgressValue = (total, elapsed) => {
      if (total <= 0) {
        setValue(0);
        return;
      }
      
      // Calculate percentage and ensure it doesn't exceed 100%
      const percentage = Math.min(100, (elapsed / total) * 100);
      setValue(percentage);
      
      console.log(`Progress: ${percentage.toFixed(1)}% (${elapsed}/${total} seconds)`);
    };
  
    const handleSidebarToggle = (open) => {
      setIsSidebarCollapsed(!open);
    };
  
    const handleTaskUpdate = (updatedTasks) => {
      setTasks(updatedTasks);
      
      if (updatedTasks.length > 0) {
        // Get total duration in seconds
        let total = parseInt(updatedTasks[0].duration.hours || 0) * 60;
        total = total + parseInt(updatedTasks[0].duration.minutes || 0);
        let total_seconds = total * 60;
        
        // Get elapsed time in seconds
        let total_elapsed_time = parseInt(updatedTasks[0].elapsedTime || 0);
        
        // Update state values
        setTotalSeconds(total_seconds);
        setElapsedSeconds(total_elapsed_time);
        
        // Update progress bar
        updateProgressValue(total_seconds, total_elapsed_time);
        
        console.log("Tasks updated:", total_seconds, "Elapsed Time:", total_elapsed_time);
      }
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
            <div className="flex flex-col items-center">
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={value}
                gaugePrimaryColor="rgb(79 70 229)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
              />
            </div>
          </div>
          {React.cloneElement(children, { 
            tasks: tasks, 
            onTaskUpdate: handleTaskUpdate,
            progressValue: value,
            totalSeconds: totalSeconds,
            elapsedSeconds: elapsedSeconds
          })}
        </main>
      </div>
    );
  }