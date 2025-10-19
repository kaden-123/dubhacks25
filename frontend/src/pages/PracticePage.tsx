import { useState, useEffect } from 'react';
import { mockRoutines } from '../data/mockData';
import { PracticeTip } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward } from 'lucide-react';
import svgPaths from '../imports/svg-x25jpvg6ij';
import { LiveCameraView } from '../components/LiveCameraView';
import { useSnapshotCapture } from '../hooks/useSnapshotCapture';

interface PracticePageProps {
  routineId: string;
  onBack: () => void;
  onReview: () => void;
  onSettings: () => void;
}

export function PracticePage({ routineId, onBack, onReview, onSettings }: PracticePageProps) {
  const routine = mockRoutines.find((r) => r.id === routineId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(12);
  const [ghostOpacity, setGhostOpacity] = useState(60);
  const [mirrorCamera, setMirrorCamera] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Snapshot capture functionality
  const {
    captureSnapshot,
    processQueue,
    queueStatus,
    clearQueue,
    isCapturing,
    startAutoCapture,
    stopAutoCapture
  } = useSnapshotCapture({
    autoCapture: true,
    captureInterval: 500, // Capture every 500ms during practice
    maxQueueSize: 50,
    apiEndpoint: 'http://localhost:8000/api/analyze-pose',
    onSnapshotProcessed: (result) => {
      console.log('Snapshot processed:', result);
      // Handle the analysis result here
    },
    onError: (error) => {
      console.error('Snapshot error:', error);
    }
  });

  if (!routine) {
    return <div>Routine not found</div>;
  }

  const totalBeats = routine.segments.reduce((acc, seg) => acc + seg.beats, 0);
  const errorRegions = [8, 9, 15, 23, 24];

  const currentTip: PracticeTip = {
    joint: 'Right Elbow',
    message: 'Raise right elbow ~12° higher',
    beatIndex: 7,
  };

  const overallAccuracy = 82;

  const handleStart = () => {
    setCountdown(3);
    startAutoCapture(); // Start capturing snapshots when practice begins
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      setTimeout(() => {
        setCountdown(null);
        setHasStarted(true);
        setIsPlaying(true);
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0f1219]" style={{ backgroundImage: "linear-gradient(rgb(11, 14, 22) 0%, rgb(15, 18, 25) 50%, rgb(18, 22, 38) 100%)" }}>
      {/* Skip to Summary Button */}
      {hasStarted && (
        <button
          onClick={onReview}
          className="absolute top-6 right-6 z-40 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 text-white text-sm flex items-center gap-2 transition-all backdrop-blur-sm"
        >
          <SkipForward className="w-4 h-4" />
          Skip to Summary
        </button>
      )}

      {/* Start Button Overlay */}
      <AnimatePresence>
        {!hasStarted && countdown === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full">
                <Play className="w-8 h-8 text-white" />
                <span className="text-white text-2xl uppercase tracking-wider">Start Practice</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div 
                className="absolute inset-0 blur-3xl opacity-80"
                style={{
                  background: `radial-gradient(circle, ${
                    countdown === 3 ? '#22d3ee' : countdown === 2 ? '#a855f7' : '#ec4899'
                  } 0%, transparent 70%)`
                }}
              />
              <div 
                className="relative text-[200px] leading-none"
                style={{
                  color: countdown === 3 ? '#22d3ee' : countdown === 2 ? '#a855f7' : '#ec4899',
                  textShadow: `0 0 40px ${countdown === 3 ? '#22d3ee' : countdown === 2 ? '#a855f7' : '#ec4899'}`
                }}
              >
                {countdown}
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

            {/* Beat Ticks */}
            <div className="absolute h-[79.2px] left-0 top-0 w-full flex">
              {Array.from({ length: totalBeats }).map((_, beatIdx) => {
                const isStrongBeat = beatIdx % 4 === 0;
                const isErrorBeat = errorRegions.includes(beatIdx);
                const position = (beatIdx / totalBeats) * 100;
                
                return (
                  <div
                    key={beatIdx}
                    className={`absolute ${
                      isErrorBeat
                        ? 'bg-[#fb2c36] h-[32px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px]'
                        : isStrongBeat
                        ? 'bg-[rgba(255,255,255,0.4)] h-[24px] top-[43.2px]'
                        : 'bg-[rgba(255,255,255,0.15)] h-[12px] top-[55.2px]'
                    } w-px`}
                    style={{ left: `${position}%` }}
                  />
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

        {/* Three Column Layout - User, Live Feedback, Performer */}
        <div className="absolute h-[594.4px] left-[24px] top-[80px] w-[1111.2px]">
          {/* Left: User View */}
          <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[24px] rounded-[10px] to-[#121626] top-[21px] w-[400.025px]">
            <div className="h-[537px] overflow-clip relative rounded-[inherit] w-full">
              <div className="absolute left-[16.8px] top-[16.8px] z-10">
                <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px] tracking-[0.6px] uppercase">
                  User
                </p>
              </div>
              {/* Live Camera Feed */}
              <LiveCameraView 
                className="absolute inset-0 rounded-[inherit] w-full h-full"
                showMirrorButton={true}
                mirrorButtonPosition="top-right"
                onSnapshot={captureSnapshot}
                autoSnapshot={isCapturing}
                snapshotInterval={500}
              />
            </div>
            <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
          </div>

          {/* Center: Live Feedback Column */}
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
                    Great!
                  </p>
                </div>
              </div>

              {/* Live Feedback Label */}
              <div className="absolute h-[16px] left-[16px] top-[124px] w-[123.562px]">
                <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-center text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">
                  Live Feedback
                </p>
              </div>

              {/* Feedback Card */}
              {currentTip && (
                <div className="absolute bg-[rgba(173,70,255,0.1)] h-[150.5px] left-[16px] rounded-[14px] top-[156px] w-[123.562px]">
                  <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(173,70,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_20px_0px_rgba(168,85,247,0.15)]" />
                  <div className="absolute left-[16px] top-[16px] w-[16px] h-[16px]">
                    <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                      <path d={svgPaths.p39ee6532} stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M8 5.33333V8" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M8 10.6667H8.00667" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </svg>
                  </div>
                  <div className="absolute h-[16px] left-[16px] top-[42px] w-[91.563px]">
                    <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#dab2ff] text-[12px]">
                      {currentTip.joint}
                    </p>
                  </div>
                  <div className="absolute h-[52.5px] left-[16px] top-[62px] w-[91.563px]">
                    <p className="font-['Arimo',_sans-serif] font-normal leading-[17.5px] text-[14px] text-[rgba(255,255,255,0.9)]">
                      {currentTip.message}
                    </p>
                  </div>
                  <div className="absolute h-[16px] left-[16px] top-[118.5px] w-[91.563px]">
                    <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#6a7282] text-[12px]">
                      Beat {currentTip.beatIndex}
                    </p>
                  </div>
                </div>
              )}

              {/* Fire Icon */}
              {overallAccuracy >= 80 && (
                <div className="absolute left-[60px] top-[330.5px] w-[34.8px] h-[34.8px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 35 35">
                    <path d={svgPaths.p26608100} stroke="#FF8904" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2555" />
                  </svg>
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
              {/* Canvas placeholder */}
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
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p2af6372} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </svg>
                </button>

              {/* Restart Button */}
              <button className="w-10 h-10 ml-[8px] rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center border-[0.8px] border-[rgba(255,255,255,0.1)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p12949080} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d="M2 2V5.33333H5.33333" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                </button>

              <div className="h-8 w-px bg-[rgba(255,255,255,0.1)] ml-[8px]" />

              {/* Loop Controls */}
              <div className="bg-[rgba(255,255,255,0.05)] rounded-[10px] p-1 border-[0.8px] border-[rgba(255,255,255,0.1)] flex gap-1">
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

              {/* Speed */}
              <button className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M6 7L8 5" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={svgPaths.p2b522d80} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-[#99a1af]">1×</span>
              </button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-3">
              {/* Ghost */}
              <button className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d={svgPaths.p2eb9c380} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={svgPaths.p24092800} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-[#99a1af]">Ghost {ghostOpacity}%</span>
              </button>

              {/* Mirror */}
              <button 
                onClick={() => setMirrorCamera(!mirrorCamera)}
                className={`h-[29.587px] rounded-[10px] px-3 flex items-center gap-2 ${
                  mirrorCamera 
                    ? 'bg-[rgba(0,184,219,0.2)] border-[0.8px] border-[rgba(0,184,219,0.5)]' 
                    : 'bg-[rgba(255,255,255,0.05)] border-[0.8px] border-[rgba(255,255,255,0.1)]'
                }`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M1.5 3.5L4 6L1.5 8.5V3.5Z" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.5 3.5L8 6L10.5 8.5V3.5Z" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 10V11" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7V8" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 4V5" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 1V2" stroke={mirrorCamera ? "#00D3F2" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`text-xs ${mirrorCamera ? 'text-[#00d3f2]' : 'text-[#99a1af]'}`}>Mirror</span>
              </button>

              {/* Recalibrate */}
              <button className="bg-[rgba(255,255,255,0.05)] h-[29.587px] rounded-[10px] px-3 border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d={svgPaths.p2164a200} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={svgPaths.p34692400} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-[#99a1af]">Recalibrate</span>
              </button>

              {/* Settings */}
              <button onClick={onSettings} className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center border-[0.8px] border-[rgba(255,255,255,0.1)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d={svgPaths.p27ba7fa0} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p28db2b80} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
              </button>
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-3">
              <div className="bg-[rgba(0,201,80,0.1)] h-[21.587px] rounded-[8px] px-[8.8px] py-[2.8px] border-[0.8px] border-[rgba(0,201,80,0.3)]">
                <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#05df72] text-[12px]">60 FPS</p>
              </div>
              <div className="bg-[rgba(0,201,80,0.1)] h-[21.587px] rounded-[8px] px-[8.8px] py-[2.8px] border-[0.8px] border-[rgba(0,201,80,0.3)]">
                <p className="font-['Arimo',_sans-serif] font-normal leading-[16px] text-[#05df72] text-[12px]">Connection OK</p>
              </div>
              {/* Snapshot Queue Status */}
              {isCapturing && (
                <div className={`h-[21.587px] rounded-[8px] px-[8.8px] py-[2.8px] border-[0.8px] ${
                  queueStatus.isProcessing 
                    ? 'bg-[rgba(255,193,7,0.1)] border-[rgba(255,193,7,0.3)]' 
                    : 'bg-[rgba(0,201,80,0.1)] border-[rgba(0,201,80,0.3)]'
                }`}>
                  <p className={`font-['Arimo',_sans-serif] font-normal leading-[16px] text-[12px] ${
                    queueStatus.isProcessing ? 'text-[#ffc107]' : 'text-[#05df72]'
                  }`}>
                    {queueStatus.isProcessing ? 'Processing' : `${queueStatus.size} Queued`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
