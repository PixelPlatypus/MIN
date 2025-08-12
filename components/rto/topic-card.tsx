"use client"


import Link from 'next/link';

interface Topic {
  id: string;
  title: string;
  description: string;
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
      <p className="text-white/80 text-sm mb-4">{topic.description}</p>
      <div className="flex flex-col space-y-2">
        {topic.video_url && (
          <Link href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-min-accent hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Focus Areas
          </Link>
        )}
        {topic.reading_material && (
          <Link href={topic.reading_material} target="_blank" rel="noopener noreferrer" className="text-min-accent hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h10V8.414L11.586 4H6z" clipRule="evenodd" />
            </svg>
            Actions
          </Link>
        )}
      </div>
    </div>
  );
};