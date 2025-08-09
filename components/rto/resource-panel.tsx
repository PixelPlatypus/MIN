"use client";

import Link from "next/link";

interface ResourceItem {
  name: string;
  link: string;
}

interface ResourcePanelProps {
  title: string;
  resources: ResourceItem[];
}

export const ResourcePanel = ({ title, resources }: ResourcePanelProps) => {
  return (
    <div className="glass-card p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {resources.map((resource, index) => (
          <li key={index}>
            <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="min-gradient-accent hover:underline text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              {resource.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};