"use client";
import React from 'react';
import { useTheme } from "next-themes";
import Link from "next/link";
import { MagicCard } from "../components/magicui/magic-card";
import { Music, Moon, BookOpen, Coffee, Star, Building, Palmtree, CloudRainIcon, Library } from 'lucide-react';

const categories = [
  {
    title: "Cafe",
    icon: Star,
    description: "Peaceful ambient sounds",
    type: "ENVIRONMENTS"
  },
  {
    title: "Library",
    icon: Library,
    description: "Focus-enhancing tracks",
    type: "ENVIRONMENTS"
  },
  {
    title: "Rainfall Bedroom",
    icon: CloudRainIcon,
    description: "Calming atmospheres",
    type: "ENVIRONMENTS"
  },
  {
    title: "Beach",
    icon: Palmtree,
    description: "Restful soundscapes",
    type: "ENVIRONMENTS"
  },
  // {
  //   title: "About Us",
  //   icon: Building,
  //   description: "Basic techniques",
  //   type: "ENVIRONMENTS"
  // }
];

export default function StudySettingsGrid() {
  const { theme } = useTheme();

  // Helper to generate a URL-friendly slug from the category title.
  const generateSlug = (title) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const handleCardClick = () => {
    localStorage.clear();
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Section Headers for SINGLES */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories
            .filter((cat) => cat.type === "ENVIRONMENTS")
            .map((category, index) => (
              <Link
                key={index}
                href={`/categories/${generateSlug(category.title)}`}
              >
                <MagicCard
                  className="cursor-pointer p-6 min-h-[160px] transition-all hover:scale-[1.02]"
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
                      {React.createElement(category.icon, {
                        className: "w-6 h-6 text-blue-500 dark:text-blue-400"
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
