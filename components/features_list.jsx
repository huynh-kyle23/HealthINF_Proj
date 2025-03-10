"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "../components/magicui/animated-list";


let notifications = [
  {
    name: "To-Do List",
    description: "Fully integrated task manager that allows users to dictate how they want to study and for how long. Users are allowed to take control of how they would like the study",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "Audio Mixer",
    description: "An Audio Mixer that allows user to control how much ambience or relaxing music they want to play. Indeed, this provides a study space for any individual to customize and become truly immersed in audibly.",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "Immersive Background",
    description: "Users can choose of up to four different work environments each with a unique set of background music to accompany them on their study time.",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "Progress Tracker",
    description: "Users can see their work's progress individually and as a whole through the fully integrated progress bar and completed tasks tracker!",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg font-bold">{name}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

// Export both as default and named export
export function AnimatedListDemo({ className }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList delay={8500}>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}

// Export as default so it can be imported as AnimatedListDemo
export default AnimatedListDemo;