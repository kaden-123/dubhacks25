import { useState } from 'react';
import { LibraryPage } from './pages/LibraryPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { EnhancedPracticePage } from './pages/EnhancedPracticePage';
import { ReviewPage } from './pages/ReviewPage';
import { LearningModePage } from './pages/LearningModePage';
import { SettingsPage } from './pages/SettingsPage';

type Page = 'library' | 'calibration' | 'practice' | 'review' | 'learning' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('library');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  const handleSelectRoutine = (routineId: string) => {
    setSelectedRoutineId(routineId);
    setCurrentPage('calibration');
  };

  const handleCalibrationComplete = () => {
    setCurrentPage('practice');
  };

  const handleBackToLibrary = () => {
    setCurrentPage('library');
    setSelectedRoutineId(null);
  };

  const handleReview = () => {
    setCurrentPage('review');
  };

  const handleSettings = () => {
    setCurrentPage('settings');
  };

  const handleContinue = () => {
    // Use the first recent practice routine
    setSelectedRoutineId('1');
    setCurrentPage('practice');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'library':
        return (
          <LibraryPage
            onSelectRoutine={handleSelectRoutine}
            onContinue={handleContinue}
          />
        );

      case 'calibration':
        return (
          <CalibrationPage
            onComplete={handleCalibrationComplete}
            onBack={handleBackToLibrary}
          />
        );

      case 'practice':
        return selectedRoutineId ? (
          <EnhancedPracticePage
            routineId={selectedRoutineId}
            onBack={handleBackToLibrary}
            onReview={handleReview}
            onSettings={handleSettings}
          />
        ) : null;

      case 'review':
        return selectedRoutineId ? (
          <ReviewPage
            routineId={selectedRoutineId}
            onPracticeAgain={() => setCurrentPage('practice')}
            onNextSegment={() => alert('Next segment would load here')}
            onLearningMode={() => setCurrentPage('learning')}
            onBack={handleBackToLibrary}
          />
        ) : null;

      case 'learning':
        return selectedRoutineId ? (
          <LearningModePage
            routineId={selectedRoutineId}
            onBack={handleBackToLibrary}
            onReview={handleReview}
          />
        ) : null;

      case 'settings':
        return (
          <SettingsPage
            onBack={() => setCurrentPage(selectedRoutineId ? 'practice' : 'library')}
          />
        );

      default:
        return <LibraryPage onSelectRoutine={handleSelectRoutine} />;
    }
  };

  return <div className="dark min-h-screen bg-background">{renderPage()}</div>;
}
