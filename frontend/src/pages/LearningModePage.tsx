import React, { useState, useEffect } from 'react';
import { mockRoutines } from '../data/mockData';
import { PracticeTip } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, BookOpen, X } from 'lucide-react';
import svgPaths from '../imports/svg-x25jpvg6ij';
import { LiveCameraView } from '../components/LiveCameraView';

interface LearningModePageProps {
  routineId: string;
  onBack: () => void;
  onReview: () => void;
}

export function LearningModePage({ routineId, onBack, onReview }: LearningModePageProps) {
  const routine = mockRoutines.find((r) => r.id === routineId) || mockRoutines[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [loopCount, setLoopCount] = useState(8);
  const [ghostOpacity, setGhostOpacity] = useState(50);
  const [currentTutorial, setCurrentTutorial] = useState<number | null>(null);

  const totalBeats = routine.segments.reduce((acc, seg) => acc + seg.beats, 0);

  // Identified mistake beats with tutorials
  const mistakes = [
    { beat: 8, severity: 'high', issue: 'Right Elbow Position' },
    { beat: 9, severity: 'high', issue: 'Right Elbow Position' },
    { beat: 15, severity: 'medium', issue: 'Timing' },
    { beat: 23, severity: 'high', issue: 'Knee Angle' },
    { beat: 24, severity: 'medium', issue: 'Knee Angle' },
  ];

  const tutorials = [
    {
      beat: 8,
      title: 'Right Elbow Too Low',
      severity: 'high',
      tips: [
        '✋ Keep your right elbow at shoulder height',
        '💪 Engage your shoulder muscles to maintain position',
        '👀 Use the mirror to check alignment',
        '⏱️ Practice this movement slowly 5 times before continuing'
      ],
      videoUrl: null
    },
    {
      beat: 15,
      title: 'Late Timing',
      severity: 'medium',
      tips: [
        '🎵 Count "1, 2, 3" before the beat to prepare',
        '👂 Listen for the snare drum hit as your timing cue',
        '⚡ Start your movement slightly earlier than you think',
        '🔁 Repeat this 8-count section 3 times to build muscle memory'
      ],
      videoUrl: null
    },
    {
      beat: 23,
      title: 'Knee Angle Incorrect',
      severity: 'high',
      tips: [
        '🦵 Bend knees to approximately 90 degrees',
        '⬇️ Lower your center of gravity',
        '🎯 Align knees over toes, not past them',
        '💪 Engage your quads and glutes for stability'
      ],
      videoUrl: null
    }
  ];

  const errorRegions = mistakes.map(m => m.beat);

  const practiceTips: PracticeTip[] = [
    { joint: 'Right Elbow', message: 'Keep right elbow elevated at shoulder height', beatIndex: 8 },
    { joint: 'Timing', message: 'Start movement on beat 15 slightly earlier', beatIndex: 15 },
    { joint: 'Both Knees', message: 'Bend knees to 90° and engage leg muscles', beatIndex: 23 },
  ];

  const currentTip =
    practiceTips.find((tip) => Math.abs((tip.beatIndex ?? 0) - currentBeat) <= 2) ||
    practiceTips[0];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentBeat((prev) => {
        const next = (prev + 1) % totalBeats;
        
        // Auto-pause on mistake beats
        const isMistakeBeat = mistakes.some(m => m.beat === next);
        if (isMistakeBeat) {
          setIsPlaying(false);
          const tutorial = tutorials.find(t => t.beat === next);
          if (tutorial) {
            setCurrentTutorial(tutorials.indexOf(tutorial));
          }
        }
        
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, totalBeats]);

  const overallAccuracy = 82;

  const getTutorialForBeat = (beat: number) => {
    return tutorials.find(t => t.beat === beat);
  };

  const closeTutorial = () => {
    setCurrentTutorial(null);
    setIsPlaying(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0f1219]" style={{ backgroundImage: "linear-gradient(rgb(11, 14, 22) 0%, rgb(15, 18, 25) 50%, rgb(18, 22, 38) 100%)" }}>
      {/* Learning Mode Badge */}
      <div className="absolute top-6 right-6 z-40 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-sm flex items-center gap-2 shadow-lg">
        <BookOpen className="w-4 h-4" />
        Learning Mode
      </div>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {currentTutorial !== null && tutorials[currentTutorial] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-[#1a1d2e] to-[#0f1219] rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">📚</span>
                    <h2 className="text-2xl text-white">{tutorials[currentTutorial].title}</h2>
                  </div>
                  <p className="text-gray-400">Beat {tutorials[currentTutorial].beat}</p>
                </div>
                <button
                  onClick={closeTutorial}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Tutorial Tips */}
              <div className="space-y-3 mb-8">
                {tutorials[currentTutorial].tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20"
                  >
                    <p className="text-white text-lg">{tip}</p>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeTutorial}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all"
                >
                  ✅ Got it! Continue
                </button>
                <button
                  onClick={() => {
                    setCurrentBeat(tutorials[currentTutorial].beat - 4);
                    closeTutorial();
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg border border-white/10 transition-all"
                >
                  🔁 Practice This Section
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[1159.2px] h-full">
          {/* Beat Timeline at Top */}
          <div className="absolute bg-gradient-to-b from-[#1a1d2e] h-[80px] left-0 to-[rgba(0,0,0,0)] top-0 w-full">
            <div aria-hidden="true" className="absolute border-[0px_0px_0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />

            {/* Segments */}
            <div className="absolute h-[79.2px] left-0 top-0 w-full flex">
              {routine.segments.map((segment, idx) => {
                const width = (segment.beats / totalBeats) * 100;
                return (
                  <div
                    key={segment.id}
                    className="box-border h-[79.2px] relative"
                    style={{ width: `${width}%` }}
                  >
                    <div aria-hidden="true" className="absolute border-[0px_0.8px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
                    <div className="absolute left-[12px] top-[12px]">
                      <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">
                        {segment.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Beat Ticks with Mistake Highlights */}
            <div className="absolute h-[79.2px] left-0 top-0 w-full flex">
              {Array.from({ length: totalBeats }).map((_, beatIdx) => {
                const isStrongBeat = beatIdx % 4 === 0;
                const mistake = mistakes.find(m => m.beat === beatIdx);
                const isErrorBeat = !!mistake;
                const position = (beatIdx / totalBeats) * 100;
                
                return (
                  <div key={beatIdx} className="relative">
                    <div
                      className={`absolute ${
                        isErrorBeat
                          ? mistake?.severity === 'high'
                            ? 'bg-[#fb2c36] h-[32px] shadow-[0px_0px_12px_0px_rgba(239,68,68,0.8)] top-[35.2px]'
                            : 'bg-[#f9d949] h-[28px] shadow-[0px_0px_10px_0px_rgba(249,217,73,0.6)] top-[37.2px]'
                          : isStrongBeat
                          ? 'bg-[rgba(255,255,255,0.4)] h-[24px] top-[43.2px]'
                          : 'bg-[rgba(255,255,255,0.15)] h-[12px] top-[55.2px]'
                      } w-px`}
                      style={{ left: `${position}%` }}
                    />
                    
                    {/* Mistake marker with tutorial icon */}
                    {isErrorBeat && (
                      <button
                        onClick={() => {
                          const tutorialIdx = tutorials.findIndex(t => t.beat === beatIdx);
                          if (tutorialIdx !== -1) {
                            setIsPlaying(false);
                            setCurrentTutorial(tutorialIdx);
                          }
                        }}
                        className="absolute top-[8px] z-10"
                        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          mistake?.severity === 'high'
                            ? 'bg-red-500/20 border-2 border-red-500'
                            : 'bg-yellow-500/20 border-2 border-yellow-500'
                        } hover:scale-110 transition-transform cursor-pointer`}>
                          <BookOpen className="w-3 h-3 text-white" />
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Playhead */}
            <div
              className="absolute bg-[#00d3f3] h-[79.2px] shadow-[0px_0px_20px_0px_rgba(34,211,238,0.8),0px_0px_40px_0px_rgba(34,211,238,0.4)] top-0 w-[3px] transition-all duration-100"
              style={{ left: `${(currentBeat / totalBeats) * 100}%` }}
            >
              <div className="bg-[#00d3f3] h-[12px] rounded-[2.68435e+07px] shadow-[0px_0px_12px_0px_#22d3ee,0px_0px_24px_0px_rgba(34,211,238,0.6)] w-full" />
            </div>

            {/* Beat Counter */}
            <div className="absolute h-[15.988px] left-[16px] top-[51.2px]">
              <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px]">
                Beat {currentBeat}
              </p>
            </div>
            <div className="absolute h-[15.988px] right-[16px] top-[51.2px]">
              <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px]">
                {totalBeats} beats total
              </p>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="absolute h-[594.4px] left-[24px] top-[80px] w-[1111.2px]">
            {/* Left: User View */}
            <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[24px] rounded-[10px] to-[#121626] top-[21px] w-[400.025px]">
              <div className="h-[537px] overflow-clip relative rounded-[inherit] w-full">
                <div className="absolute left-[16.8px] top-[16.8px]">
                  <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px] tracking-[0.6px] uppercase">
                    User
                  </p>
                </div>
                {/* Live Camera Feed */}
                <LiveCameraView
                  className="absolute inset-0 rounded-[inherit] w-full h-full"
                  showMirrorButton={true}
                  mirrorButtonPosition="top-right"
                />
              </div>
              <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
            </div>

            {/* Center: Live Feedback + Tutorials */}
            <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[466px] rounded-[10px] to-[#121626] top-[24px] w-[156px]">
              <div className="h-[515px] overflow-clip relative rounded-[inherit] w-[155.562px]">
                {/* Accuracy Badge */}
                <div className="absolute bg-[rgba(0,201,80,0.1)] box-border h-[84px] left-[16px] rounded-[16px] shadow-[0px_0px_20px_0px_rgba(34,197,94,0.2)] top-[16px] w-[123.562px]">
                  <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(0,201,80,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <div className="pt-[16px] px-[16px]">
                    <p className="font-['Arimo',_sans-serif] font-normal leading-[36px] text-[#05df72] text-[30px] text-center">
                      {overallAccuracy}%
                    </p>
                    <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#99a1af] text-[12px] text-center tracking-[0.6px] uppercase">
                      Learning
                    </p>
                  </div>
                </div>

                {/* Tutorial Hint */}
                <div className="absolute h-[16px] left-[16px] top-[124px] w-[123.562px]">
                  <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-center text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">
                    Tutorials
                  </p>
                </div>

                {/* Tutorial Indicator */}
                <div className="absolute left-[16px] top-[156px] w-[123.562px]">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[14px] p-4 border border-purple-500/20 text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <p className="font-['Arimo',_sans-serif] text-[10px] text-white/90 mb-1">
                      {mistakes.length} Areas to Learn
                    </p>
                    <p className="font-['Arimo',_sans-serif] text-[10px] text-gray-400">
                      Click markers on timeline
                    </p>
                  </div>
                </div>

                {/* Current Feedback Card */}
                {currentTip && (
                  <div className="absolute bg-[rgba(173,70,255,0.1)] h-[100px] left-[16px] rounded-[14px] top-[280px] w-[123.562px]">
                    <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(173,70,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_20px_0px_rgba(168,85,247,0.15)]" />
                    <div className="p-3">
                      <div className="w-[16px] h-[16px] mb-2">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path d={svgPaths.p39ee6532} stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          <path d="M8 5.33333V8" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          <path d="M8 10.6667H8.00667" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                      <p className="font-['Arimo',_sans-serif] font-normal leading-[12px] text-[#dab2ff] text-[10px] mb-1">
                        {currentTip.joint}
                      </p>
                      <p className="font-['Arimo',_sans-serif] font-normal leading-[13px] text-[11px] text-[rgba(255,255,255,0.9)] mb-1">
                        {currentTip.message}
                      </p>
                      <p className="font-['Arimo',_sans-serif] font-normal leading-[12px] text-[#6a7282] text-[10px]">
                        Beat {currentTip.beatIndex}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
            </div>

            {/* Right: Performer View */}
            <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[673px] rounded-[10px] to-[#121626] top-[24px] w-[438px]">
              <div className="h-[537px] overflow-clip relative rounded-[inherit] w-full">
                <div className="absolute left-[301.15px] top-[16.8px]">
                  <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px] tracking-[0.6px] uppercase">
                    Performer
                  </p>
                </div>
                <div className="absolute h-full w-full flex items-center justify-center text-gray-600 text-4xl">
                  💃
                </div>
              </div>
              <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
            </div>
          </div>

          {/* Control Bar */}
          <div className="absolute bg-gradient-to-b from-[#0f1219] h-[80.8px] left-0 to-[#0f1219] top-[674.4px] via-50% via-[#13161f] w-full">
            <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
            <div className="absolute left-[24px] top-0 w-[1111.2px] h-[80.8px] flex items-center justify-between">
              {/* Left Controls */}
              <div className="h-[48px] flex items-center gap-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>

                <button 
                  onClick={() => setCurrentBeat(0)}
                  className="w-10 h-10 ml-[8px] rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center border-[0.8px] border-[rgba(255,255,255,0.1)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p12949080} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M2 2V5.33333H5.33333" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                </button>

                <div className="h-8 w-px bg-[rgba(255,255,255,0.1)] ml-[8px]" />

                <div className="ml-[8px] bg-[rgba(255,255,255,0.05)] rounded-[10px] p-1 border-[0.8px] border-[rgba(255,255,255,0.1)] flex gap-1">
                  <button className="bg-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded text-xs text-white flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                      <path d="M8.5 1L10.5 3L8.5 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.pc185880} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 11L1.5 9L3.5 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.p1b93600} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    8
                  </button>
                  <button className="px-3 py-1.5 rounded text-xs text-[#6a7282] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                      <path d="M8.5 1L10.5 3L8.5 5" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.pc185880} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 11L1.5 9L3.5 7" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.p1b93600} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    16
                  </button>
                </div>

                <button className="ml-[8px] bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d="M6 7L8 5" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPaths.p2b522d80} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-[#99a1af]">0.5×</span>
                </button>
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-3">
                <button className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d={svgPaths.p2eb9c380} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPaths.p24092800} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-[#99a1af]">Ghost {ghostOpacity}%</span>
                </button>

                <button className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d={svgPaths.p2af6372} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-[#99a1af]">Mirror</span>
                </button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onReview}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-[29.587px] rounded-[10px] px-4 flex items-center gap-2"
                >
                  <span className="text-xs text-white">Finish Learning</span>
                </button>

                <button
                  onClick={onBack}
                  className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p27ba7fa0} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p28db2b80} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
