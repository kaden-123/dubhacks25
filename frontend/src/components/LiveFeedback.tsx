import { useState, useEffect } from 'react';
import { PracticeTip } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2, AlertCircle } from 'lucide-react';

interface LiveFeedbackProps {
  overallAccuracy: number;
  currentTip?: PracticeTip;
  isPlaying: boolean;
}

export function LiveFeedback({ overallAccuracy, currentTip, isPlaying }: LiveFeedbackProps) {
  const [feedbackMessages, setFeedbackMessages] = useState<Array<{ id: number; message: string; type: 'success' | 'warning' | 'tip' }>>([]);
  const [messageId, setMessageId] = useState(0);

  useEffect(() => {
    // Only show real feedback from currentTip, not simulated messages
    if (currentTip && currentTip.message) {
      const newId = messageId + 1;
      setMessageId(newId);
      
      setFeedbackMessages((prev) => [...prev, { 
        id: newId, 
        message: currentTip.message, 
        type: 'tip' as const 
      }]);

      // Remove message after 3 seconds
      setTimeout(() => {
        setFeedbackMessages((prev) => prev.filter((msg) => msg.id !== newId));
      }, 3000);
    }
  }, [currentTip]); // Removed messageId from dependencies to fix infinite loop

  const getAccuracyColor = () => {
    if (overallAccuracy >= 80) return 'text-green-400';
    if (overallAccuracy >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAccuracyLabel = () => {
    if (overallAccuracy >= 90) return 'Excellent!';
    if (overallAccuracy >= 80) return 'Great!';
    if (overallAccuracy >= 70) return 'Good';
    if (overallAccuracy >= 60) return 'Keep going';
    return 'Focus!';
  };

  return (
    <div className="h-full flex flex-col py-6 px-4 bg-gradient-to-b from-[#0f1219] to-[#13161f]">
      {/* Status Badge at Top */}
      <div className="mb-8">
        <div className="relative">
          <div 
            className={`text-center py-4 px-6 rounded-2xl border-2 ${
              overallAccuracy >= 80 
                ? 'bg-green-500/10 border-green-500/50' 
                : overallAccuracy >= 60
                ? 'bg-yellow-500/10 border-yellow-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
            style={{
              boxShadow: overallAccuracy >= 80 
                ? '0 0 20px rgba(34, 197, 94, 0.2)' 
                : overallAccuracy >= 60
                ? '0 0 20px rgba(234, 179, 8, 0.2)'
                : '0 0 20px rgba(239, 68, 68, 0.2)'
            }}
          >
            <div className={`text-3xl mb-1 ${getAccuracyColor()}`}>
              {Math.round(overallAccuracy)}%
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              {getAccuracyLabel()}
            </div>
          </div>
        </div>
      </div>

      {/* Live Feedback Messages */}
      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-4 text-center">
          Live Feedback
        </div>
        
        <AnimatePresence mode="popLayout">
          {currentTip && (
            <motion.div
              key="current-tip"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)'
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-purple-300 mb-1">{currentTip.joint}</div>
                  <div className="text-sm text-white/90 leading-tight">{currentTip.message}</div>
                  {currentTip.beatIndex !== undefined && (
                    <div className="text-xs text-gray-500 mt-1">Beat {currentTip.beatIndex}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {feedbackMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-xl backdrop-blur-sm ${
                msg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : msg.type === 'warning'
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}
            >
              <div className="text-sm text-white/90 text-center">{msg.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Motivational Icon at Bottom */}
      <div className="mt-auto pt-6 flex justify-center">
        {overallAccuracy >= 80 ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-8 h-8 text-orange-400" />
          </motion.div>
        ) : (
          <CheckCircle2 className="w-8 h-8 text-gray-600" />
        )}
      </div>
    </div>
  );
}
