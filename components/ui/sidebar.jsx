"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Star, Library, CloudRainIcon, Palmtree, Building } from 'lucide-react'; // Import icons

const categories = [
  { title: "Cafe", icon: Star, description: "Peaceful ambient sounds", type: "SINGLES" },
  { title: "Library", icon: Library, description: "Focus-enhancing tracks", type: "SINGLES" },
  { title: "Rainfall Bedroom", icon: CloudRainIcon, description: "Calming atmospheres", type: "SINGLES" },
  { title: "Beach", icon: Palmtree, description: "Restful soundscapes", type: "PLANS" },
  { title: "Foundations", icon: Building, description: "Basic techniques", type: "PLANS" }
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

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, ...props }) => {
  const { open, setOpen, animate, isClient } = useSidebar();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    duration: { hours: "", minutes: "" },
    breaks: "",
    environment: categories[0].title
  });
  const taskListRef = useRef(null);
  const lastTaskRef = useRef(null);
  const [isNewTaskAdded, setIsNewTaskAdded] = useState(false);
  

  // Load tasks from localStorage after component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem('sidebarTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      setTasks([...tasks, { ...newTask }]);
      setNewTask({
        name: "",
        duration: { hours: "", minutes: "" },
        breaks: "",
        environment: categories[0].title
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
  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    if (isNewTaskAdded && tasks.length > 0 && lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({ behavior: "smooth" });
      setIsNewTaskAdded(false);
    }
  }, [tasks, isNewTaskAdded]);

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 h-full px-4 py-4 flex flex-col bg-white flex-shrink-0 border-r shadow-lg z-50 transition-all duration-300",
        className
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
              className="flex flex-col mb-4 p-2 border rounded transition-all duration-300"
            >
              {!isClient || open ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{task.name}</span>
                    <button onClick={() => handleDeleteTask(index)} className="text-red-500">Delete</button>
                  </div>
                  <div>Duration: {task.duration.hours}h {task.duration.minutes}m</div>
                  <div>Breaks: {task.breaks}</div>
                  <div>Environment: {task.environment}</div>
                </>
              ) : (
                <Image
                  src="/homework-svgrepo-com.svg"
                  alt="Homework icon"
                  width={24}
                  height={24}
                  priority
                />
              )}
            </li>
          ))}
        </ul>
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
