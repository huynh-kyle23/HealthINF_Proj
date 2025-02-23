"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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
  const [newTask, setNewTask] = useState("");
  const taskListRef = useRef(null);
  const lastTaskRef = useRef(null);

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
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleToggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  useEffect(() => {
    if (tasks.length > 0 && lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tasks]);

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white flex-shrink-0 border-r shadow-lg",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
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
        className="flex-1 overflow-y-auto"
      >
        <ul className="pr-1">
          {tasks.map((task, index) => (
            <li
              key={index}
              ref={index === tasks.length - 1 ? lastTaskRef : null}
              className="flex items-center mb-2 transition-all duration-300"
            >
              {!isClient || open ? (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(index)}
                    className="mr-2"
                  />
                  <span
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {task.text}
                  </span>
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

      <div
        className={cn(
          "mt-2 pt-2 border-t flex-shrink-0 transition-all duration-300 w-full", 
          open ? "opacity-100 visible" : "opacity-0 invisible h-0"
        )}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="New task"
          className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </motion.div>
  );
};