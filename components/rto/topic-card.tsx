"use client"


import Link from 'next/link';

interface Topic {
  id: string;
  title: string;
  video_url?: string;
  reading_material?: string;
}

interface TopicCardProps {
  topic: Topic;
  index: number;
}

export const TopicCard = ({ topic, index }: TopicCardProps) => {
  return (
    <div
      className="glass-dark rounded-2xl p-6 shadow-lg border border-gray-700/50 transform transition-transform duration-300 hover:scale-105"
    >
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h4 className="text-xl font-semibold text-white">{topic.title}</h4>
      </div>

    </div>
  );
};