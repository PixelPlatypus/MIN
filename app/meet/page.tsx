'use client';

import { useEffect } from 'react';

export default function MeetPage() {
  useEffect(() => {
    window.location.href = 'https://meet.google.com/cgt-bath-jft';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <p className="text-lg">Redirecting to Google Meet...</p>
      <p className="text-sm mt-2">If you are not redirected automatically, please click <a href="https://meet.google.com/cgt-bath-jft" className="text-blue-500 hover:underline">here</a>.</p>
    </div>
  );
}