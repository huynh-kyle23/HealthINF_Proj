"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Star, Library, CloudRainIcon, Palmtree, Building, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


const categories = [
  { title: "Cafe", icon: Star, description: "Peaceful ambient sounds", type: "ENVIRONMENTS" },
  { title: "Library", icon: Library, description: "Focus-enhancing tracks", type: "ENVIRONMENTS" },
  { title: "Rainfall Bedroom", icon: CloudRainIcon, description: "Calming atmospheres", type: "ENVIRONMENTS" },
  { title: "Beach", icon: Palmtree, description: "Restful soundscapes", type: "ENVIRONMENTS" },
  { title: "Foundations", icon: Building, description: "Basic techniques", type: "ENVIRONMENTS" }
];

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setOpenState(JSON.parse(saved));
    }
  }, []);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarOpen', JSON.stringify(open));
    }
  }, [open, isClient]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, isClient }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({ tasks, onTaskUpdate, ...props }) => {
  const { open, setOpen, animate, isClient } = useSidebar();
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    name: "",
    duration: { hours: "", minutes: "" },
    breaks: "",
    environment: categories[0].title,
    elapsedTime: 0,
    isRunning: false
  });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const taskListRef = useRef(null);
  const lastTaskRef = useRef(null);
  const [isNewTaskAdded, setIsNewTaskAdded] = useState(false);

  const navigateToEnvironment = (environment) => {
    router.push(`/categories/${environment.toLowerCase()}`);
  };

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      const newTaskWithId = { 
        ...newTask, 
        id: Date.now(),
        duration: {
          hours: newTask.duration.hours || "0",
          minutes: newTask.duration.minutes || "0"
        }
      };
      
      // If this is the first task and no other tasks are running, start it automatically
      if (tasks.length === 0 || !tasks.some(task => task.isRunning)) {
        newTaskWithId.isRunning = true;
      }
      
      onTaskUpdate([...tasks, newTaskWithId]);
      console.log("New task added:", newTaskWithId);
      setNewTask({
        name: "",
        duration: { hours: "", minutes: "" },
        breaks: "",
        environment: categories[0].title,
        elapsedTime: 0,
        isRunning: false
      });
      setIsNewTaskAdded(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "hours" || name === "minutes") {
      setNewTask(prev => ({
        ...prev,
        duration: { ...prev.duration, [name]: value }
      }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    onTaskUpdate(updatedTasks);
    
    // If we deleted a running task and there are other tasks, start the next one
    const deletedTask = tasks.find(task => task.id === id);
    if (deletedTask && deletedTask.isRunning && updatedTasks.length > 0) {
      startNextTask(updatedTasks);
    }
  };

  const handleStartStop = (id) => {
    // Stop all tasks first
    const allStopped = tasks.map(task => ({ ...task, isRunning: false }));
    
    // Then start the selected one
    const updatedTasks = allStopped.map(task => 
      task.id === id ? { ...task, isRunning: true } : task
    );
    
    onTaskUpdate(updatedTasks);
  };

  const startNextTask = (currentTasks) => {
    if (currentTasks.length === 0) return;
    
    // Find the first uncompleted task and start it
    const updatedTasks = [...currentTasks];
    updatedTasks[0].isRunning = true;
    onTaskUpdate(updatedTasks);
  };

  const completeTask = (task) => {
    // Add to completed tasks
    setCompletedTasks(prev => [...prev, {...task, completedAt: new Date()}]);
    
    // Remove from current tasks
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    
    // If there are more tasks, start the next one
    if (updatedTasks.length > 0) {
      const nextTasks = [...updatedTasks];
      nextTasks[0].isRunning = true;
      onTaskUpdate(nextTasks);
      if (nextTasks[0].environment !== task.environment) {
        navigateToEnvironment(nextTasks[0].environment);
      }
    } else {
      onTaskUpdate([]);
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && tasks[0].isRunning) {
      navigateToEnvironment(tasks[0].environment);
    }
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      let taskCompleted = false;
      
      const updatedTasks = tasks.map(task => {
        if (task.isRunning) {
          const newElapsedTime = task.elapsedTime + 1;
          
          // Check if task is completed
          const taskDurationInSeconds = (parseInt(task.duration.hours) * 3600) + (parseInt(task.duration.minutes) * 60);
          
          if (newElapsedTime >= taskDurationInSeconds && taskDurationInSeconds > 0) {
            // Task is completed
            taskCompleted = task;
            return task; // Will be removed in the next step
          }
          
          return { ...task, elapsedTime: newElapsedTime };
        }
        return task;
      });
      
      if (taskCompleted) {
        completeTask(taskCompleted);
      } else {
        onTaskUpdate(updatedTasks);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tasks, onTaskUpdate]);

  // Ensure a task is always running if there are tasks
  useEffect(() => {
    if (tasks.length > 0 && !tasks.some(task => task.isRunning)) {
      startNextTask(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (isNewTaskAdded && tasks.length > 0 && lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({ behavior: "smooth" });
      setIsNewTaskAdded(false);
    }
  }, [tasks, isNewTaskAdded]);

  // Calculate task progress
  const getTaskProgress = (task) => {
    const totalSeconds = (parseInt(task.duration.hours) * 3600) + (parseInt(task.duration.minutes) * 60);
    if (totalSeconds === 0) return 0;
    return Math.min(100, (task.elapsedTime / totalSeconds) * 100);
  };

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 h-full px-4 py-4 flex flex-col bg-white flex-shrink-0 border-r shadow-lg z-50 transition-all duration-300",
        props.className
      )}
      animate={{
        width: animate ? (open ? "400px" : "60px") : "400px",
      }}
      initial={{
        width: "60px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-lg font-semibold">
          {!isClient || open ? (
            "To-Do List"
          ) : (
            <Image
              src="/interface-ui-check-box-checkbox-todo-list-svgrepo-com.svg"
              alt="Todo list icon"
              width={24}
              height={24}
              priority
            />
          )}
        </h2>
      </div>

      <div 
        ref={taskListRef}
        className={cn(
          "flex-1 transition-all duration-300",
          open ? "overflow-y-auto" : "overflow-hidden"
        )}
      >
        <ul className={cn("pr-1", !open && "flex flex-col items-center")}>
          {tasks.map((task, index) => (
            <li
              key={index}
              ref={index === tasks.length - 1 ? lastTaskRef : null}
              className={`flex flex-col mb-4 p-2 border rounded transition-all duration-300 ${task.isRunning ? 'border-blue-500 bg-blue-50' : ''}`}
            >
              {!isClient || open ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{task.name}</span>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-sm">Duration: {task.duration.hours}h {task.duration.minutes}m</div>
                  <div className="text-sm">Breaks: {task.breaks || '0'}</div>
                  <div className="text-sm">Environment: {task.environment}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${getTaskProgress(task)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <button 
                      onClick={() => handleStartStop(task.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        task.isRunning 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {task.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <span className="text-sm font-mono">{formatTime(task.elapsedTime)}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center">
                  {task.isRunning ? (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  ) : (
                    <Image
                      src="/homework-svgrepo-com.svg"
                      alt="Homework icon"
                      width={24}
                      height={24}
                      priority
                    />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        
        {/* Completed tasks section */}
        {open && completedTasks.length > 0 && (
          <div className="mt-4 border-t pt-2">
            <button 
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <CheckCircle size={16} className="mr-1" />
              {showCompletedTasks ? 'Hide' : 'Show'} completed tasks ({completedTasks.length})
            </button>
            
            {showCompletedTasks && (
              <ul className="mt-2 opacity-70">
                {completedTasks.map((task, index) => (
                  <li key={index} className="flex justify-between items-center py-1 text-sm">
                    <span>{task.name}</span>
                    <span className="text-xs">{formatTime(task.elapsedTime)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {open && (
        <div className="mt-2 pt-2 border-t flex-shrink-0">
          <input
            type="text"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Task name"
            className="border rounded-md px-4 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="hours"
                value={newTask.duration.hours}
                onChange={handleInputChange}
                placeholder="Hours"
                className="border rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="minutes"
                value={newTask.duration.minutes}
                onChange={handleInputChange}
                placeholder="Minutes"
                className="border rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="breaks" className="block text-sm font-medium text-gray-700 mb-1">Number of breaks</label>
            <input
              type="text"
              id="breaks"
              name="breaks"
              value={newTask.breaks}
              onChange={handleInputChange}
              placeholder="Enter number of breaks"
              className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select
              id="environment"
              name="environment"
              value={newTask.environment}
              onChange={handleInputChange}
              className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category, index) => (
                <option key={index} value={category.title}>{category.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      )}
    </motion.div>
  );
};

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
//Fix start issue
