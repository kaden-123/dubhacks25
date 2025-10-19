/**
 * Enhanced Practice Example
 * 
 * This example demonstrates how to use the enhanced video playback system
 * with real camera integration and mock feedback.
 */

import React, { useState } from 'react';
import { EnhancedPracticePage } from '../pages/EnhancedPracticePage';

export function EnhancedPracticeExample() {
  const [currentPage, setCurrentPage] = useState<'library' | 'practice'>('library');

  const handleSelectRoutine = (routineId: string) => {
    setCurrentPage('practice');
  };

  const handleBackToLibrary = () => {
    setCurrentPage('library');
  };

  const handleReview = () => {
    console.log('Review session completed');
    setCurrentPage('library');
  };

  const handleSettings = () => {
    console.log('Settings opened');
  };

  if (currentPage === 'library') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white mb-8">
            Enhanced Practice System
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {[
              { id: '1', title: 'Magnetic', artist: 'ILLIT', difficulty: 'Intermediate' },
              { id: '2', title: 'Kill This Love', artist: 'BLACKPINK', difficulty: 'Advanced' },
              { id: '3', title: 'GO!', artist: 'cortis', difficulty: 'Beginner' },
            ].map((routine) => (
              <button
                key={routine.id}
                onClick={() => handleSelectRoutine(routine.id)}
                className="p-6 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition-all backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold mb-2">{routine.title}</h3>
                <p className="text-gray-300 mb-2">{routine.artist}</p>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {routine.difficulty}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300">
            <p className="text-sm">
              🎯 <strong>Features:</strong> Real camera capture, video playback, beat synchronization, mock feedback
            </p>
            <p className="text-xs mt-2 text-blue-400">
              Select a routine to start practicing with the enhanced system!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EnhancedPracticePage
      routineId="1"
      onBack={handleBackToLibrary}
      onReview={handleReview}
      onSettings={handleSettings}
    />
  );
}

export default EnhancedPracticeExample;
