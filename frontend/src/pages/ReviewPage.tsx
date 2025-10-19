import { useState } from 'react';
import { mockRoutines } from '../data/mockData';
import svgPaths from '../imports/svg-yxbdxs5thx';

interface ReviewPageProps {
  routineId: string;
  segmentId?: string;
  onPracticeAgain: () => void;
  onNextSegment?: () => void;
  onBack: () => void;
  onLearningMode?: () => void;
}

export function ReviewPage({ routineId, segmentId, onPracticeAgain, onBack, onLearningMode }: ReviewPageProps) {
  const routine = mockRoutines.find((r) => r.id === routineId);
  const segment = routine?.segments.find((s) => s.id === segmentId) || routine?.segments[0];

  const [viewMode, setViewMode] = useState<'pose' | 'timing'>('pose');
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(40);

  const overallAccuracy = 82;
  const timingAccuracy = 79;
  const poseAccuracy = 86;
  const consistency = 82;

  // Mock beat-by-beat performance data (48 beats)
  const beatPerformance = [
    77, 88, 71, 89, 75, 73, 83, 88, 55, 54, 72, 97, 83, 80, 76, 77,
    77, 99, 98, 96, 81, 90, 94, 54, 69, 98, 97, 99, 72, 81, 77, 89,
    94, 96, 95, 76, 88, 71, 76, 73, 91, 81, 73, 79, 99, 83, 98, 71
  ];

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'S', emoji: '💎', color: '#00d3f3' };
    if (score >= 80) return { letter: 'A', emoji: '🔥', color: '#05df72' };
    if (score >= 70) return { letter: 'B', emoji: '💫', color: '#f9d949' };
    if (score >= 60) return { letter: 'C', emoji: '⭐', color: '#ff8904' };
    return { letter: 'D', emoji: '💪', color: '#fb2c36' };
  };

  const grade = getGrade(overallAccuracy);

  const getBarColor = (accuracy: number) => {
    if (accuracy >= 80) return '#05df72';
    if (accuracy >= 60) return '#f9d949';
    return '#fb2c36';
  };

  const getBarOpacity = (accuracy: number) => {
    if (accuracy >= 80) return 0.25;
    if (accuracy >= 60) return 0.25;
    return 0.25;
  };

  const corrections = [
    {
      emoji: '🦾',
      title: 'Right Elbow',
      segment: 'Intro',
      beat: 7,
      description: 'Right elbow too low in verse 1',
      severity: 'high' as const
    },
    {
      emoji: '💃',
      title: 'Timing',
      segment: 'Intro',
      beat: 15,
      description: 'Late on beat 15 by ~110 ms',
      severity: 'medium' as const
    },
    {
      emoji: '🦵',
      title: 'Both Knees',
      segment: 'Intro',
      beat: 23,
      description: 'Knee angle off by ~15°',
      severity: 'medium' as const
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#0b0e16] via-50% via-[#0f1219] to-[#121626] min-h-screen">
      <div className="relative w-full pb-24">
        {/* Header */}
        <div className="absolute left-[24px] top-[24px] flex gap-[16px] items-center h-[40px] w-[1096px]">
          <button
            onClick={onBack}
            className="bg-[rgba(255,255,255,0.05)] relative rounded-[2.68435e+07px] shrink-0 size-[40px] flex items-center justify-center border-[0.8px] border-[rgba(255,255,255,0.1)]"
          >
            <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
              <path d={svgPaths.p33f6b680} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d="M15.8333 10H4.16667" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </button>
          <div className="h-[40px] w-[174.45px]">
            <p className="font-['Arimo',_sans-serif] font-normal leading-[20px] text-[#99a1af] text-[14px] tracking-[0.35px] uppercase">
              Performance Summary
            </p>
            <p className="font-['Arimo',_sans-serif] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.6)]">
              {routine?.title} - {segment?.name}
            </p>
          </div>
        </div>

        {/* Hero Score Section */}
        <div className="absolute h-[419.188px] left-[24px] top-[88px] w-[1096px]">
          {/* Radial glow background */}
          <div className="absolute h-[419.188px] left-0 opacity-30 top-0 w-[1096px]"
            style={{ 
              background: `radial-gradient(ellipse 1096px 128.494px at 50% 20%, rgba(5,223,114,0.2) 0%, rgba(3,112,57,0.1) 25%, rgba(0,0,0,0) 50%)`
            }} 
          />
          
          {/* Main card */}
          <div className="absolute bg-gradient-to-b from-[rgba(26,29,46,0.8)] to-[rgba(15,18,25,0.6)] h-[419.188px] left-0 rounded-[16px] top-0 w-[1096px] border-[0.8px] border-[rgba(255,255,255,0.1)]">
            <div className="px-[32.8px] pt-[32.8px]">
              {/* Score and Grade */}
              <div className="flex flex-col items-center mb-[32px]">
                <div className="text-center mb-[24px]">
                  <span 
                    className="text-[120px] leading-[120px] tracking-[-3px]"
                    style={{ color: grade.color, textShadow: `0 0 40px ${grade.color}80` }}
                  >
                    {overallAccuracy}
                  </span>
                  <span className="text-[48px] leading-[48px] text-[rgba(255,255,255,0.4)]">%</span>
                </div>
                
                <div className="flex items-center gap-[12px]">
                  <span className="text-[60px] leading-[60px]">{grade.emoji}</span>
                  <span 
                    className="text-[36px] leading-[40px] tracking-[1.8px] uppercase"
                    style={{ color: grade.color }}
                  >
                    {grade.letter} RANK - GREAT!
                  </span>
                </div>
              </div>

              {/* Sub-metrics */}
              <div className="grid grid-cols-3 gap-[16px] max-w-[768px] mx-auto">
                {/* Timing */}
                <div className="bg-gradient-to-b from-[rgba(173,70,255,0.1)] to-[rgba(0,0,0,0)] rounded-[14px] border-[0.8px] border-[rgba(173,70,255,0.2)] p-[16.8px]">
                  <div className="flex items-center gap-[8px] mb-[8px]">
                    <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p30c3b00} stroke="#A855F7" strokeWidth="1.5" />
                      <path d="M10 6V10L13 13" stroke="#A855F7" strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                    <span className="font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px]">Timing</span>
                  </div>
                  <p className="font-['Arimo',_sans-serif] text-[30px] leading-[36px] text-[#c27aff] text-center">{timingAccuracy}%</p>
                  <p className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282] text-center">Beats on time</p>
                </div>

                {/* Pose */}
                <div className="bg-gradient-to-b from-[rgba(0,184,219,0.1)] to-[rgba(0,0,0,0)] rounded-[14px] border-[0.8px] border-[rgba(0,184,219,0.2)] p-[16.8px]">
                  <div className="flex items-center gap-[8px] mb-[8px]">
                    <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p3998eb80} stroke="#00D3F3" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                    <span className="font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px]">Pose</span>
                  </div>
                  <p className="font-['Arimo',_sans-serif] text-[30px] leading-[36px] text-[#00d3f2] text-center">{poseAccuracy}%</p>
                  <p className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282] text-center">Avg angle match</p>
                </div>

                {/* Consistency */}
                <div className="bg-gradient-to-b from-[rgba(0,201,80,0.1)] to-[rgba(0,0,0,0)] rounded-[14px] border-[0.8px] border-[rgba(0,201,80,0.2)] p-[16.8px]">
                  <div className="flex items-center gap-[8px] mb-[8px]">
                    <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p3ac0b600} stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p3c797180} stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </svg>
                    <span className="font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px]">Consistency</span>
                  </div>
                  <p className="font-['Arimo',_sans-serif] text-[30px] leading-[36px] text-[#05df72] text-center">{consistency}%</p>
                  <p className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282] text-center">Timing variance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Timeline */}
        <div className="absolute bg-gradient-to-b from-[rgba(26,29,46,0.6)] to-[rgba(15,18,25,0.4)] h-[255.175px] left-[24px] rounded-[14px] top-[531.19px] w-[1096px] border-[0.8px] border-[rgba(255,255,255,0.1)] px-[24.8px] pt-[24.8px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className="font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px]">Performance Timeline</p>
            
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[10px] border-[0.8px] border-[rgba(255,255,255,0.1)] p-1 flex gap-1">
              <button
                onClick={() => setViewMode('pose')}
                className={`px-3 h-[27.988px] rounded text-[12px] font-['Arimo',_sans-serif] ${
                  viewMode === 'pose' ? 'bg-[rgba(255,255,255,0.1)] text-white' : 'text-[#6a7282]'
                }`}
              >
                Pose Error
              </button>
              <button
                onClick={() => setViewMode('timing')}
                className={`px-3 h-[27.988px] rounded text-[12px] font-['Arimo',_sans-serif] ${
                  viewMode === 'timing' ? 'bg-[rgba(255,255,255,0.1)] text-white' : 'text-[#6a7282]'
                }`}
              >
                Timing Error
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-[128px] relative w-full">
            {beatPerformance.map((accuracy, idx) => {
              const height = (accuracy / 100) * 128;
              const color = getBarColor(accuracy);
              const isError = accuracy < 70;
              
              return (
                <div
                  key={idx}
                  className="absolute box-border flex flex-col pb-0 rounded-tl-[6px] rounded-tr-[6px]"
                  style={{
                    backgroundColor: color,
                    height: `${height}px`,
                    left: `${idx * 21.51}px`,
                    top: `${128 - height}px`,
                    width: '19.512px',
                    boxShadow: isError ? `0px 0px 8px 0px ${color}80` : 'none'
                  }}
                >
                  <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 hover:opacity-100 relative rounded-[4px] w-full transition-opacity">
                    <p className="absolute font-['Arimo',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] whitespace-nowrap">
                      Beat {idx}: {Math.round(accuracy)}%
                    </p>
                    {isError && (
                      <p className="absolute font-['Arimo',_sans-serif] font-normal leading-[13.333px] left-[8px] text-[#ff6467] text-[10px] top-[19.99px]">
                        Error detected
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between mt-[16px]">
            <span className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282]">0s</span>
            <span className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282]">199s</span>
          </div>
        </div>

        {/* Top 3 Corrections */}
        <div className="absolute left-[24px] top-[810.36px] w-[536px] h-[438.363px]">
          <div className="bg-gradient-to-b from-[rgba(26,29,46,0.6)] to-[rgba(15,18,25,0.4)] h-[439px] rounded-[14px] border-[0.8px] border-[rgba(255,255,255,0.1)] px-[24.8px] pt-[24.8px]">
            <div className="flex items-center gap-[8px] mb-[16px]">
              <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                <path d={svgPaths.p39ee6532} stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d="M8 5.33333V8" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d="M8 10.6667H8.00667" stroke="#C27AFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <p className="font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px]">Top 3 Corrections</p>
            </div>

            <div className="flex flex-col gap-[12px]">
              {corrections.map((correction, idx) => (
                <div
                  key={idx}
                  className={`rounded-[14px] p-[16.8px] ${
                    correction.severity === 'high'
                      ? 'bg-[rgba(251,44,54,0.1)] border-[0.8px] border-[rgba(251,44,54,0.3)]'
                      : 'bg-[rgba(240,177,0,0.1)] border-[0.8px] border-[rgba(240,177,0,0.3)]'
                  }`}
                >
                  <div className="flex gap-[12px]">
                    <span className="text-[30px] leading-[36px]">{correction.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <span className="font-['Arimo',_sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.9)]">
                          {correction.title}
                        </span>
                        <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] border-[0.8px] border-[rgba(255,255,255,0.2)] px-[8.8px] py-[2.8px]">
                          <span className="font-['Arimo',_sans-serif] text-[12px] text-neutral-50">
                            {correction.segment}, beat {correction.beat}
                          </span>
                        </div>
                      </div>
                      <p className="font-['Arimo',_sans-serif] text-[14px] leading-[20px] text-[#99a1af] mb-[12px]">
                        {correction.description}
                      </p>
                      <button className="flex items-center gap-[4px]">
                        <svg className="size-[12px]" fill="none" viewBox="0 0 12 12">
                          <path d={svgPaths.p32f38800} stroke="#00D3F2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-['Arimo',_sans-serif] text-[12px] leading-[16px] text-[#00d3f2]">Watch</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side-by-Side Replay */}
        <div className="absolute bg-gradient-to-b from-[rgba(26,29,46,0.6)] to-[rgba(15,18,25,0.4)] h-[438px] left-[584px] rounded-[14px] top-[810.36px] w-[536px] border-[0.8px] border-[rgba(255,255,255,0.1)]">
          <p className="absolute font-['Arimo',_sans-serif] text-[14px] text-[#99a1af] uppercase tracking-[0.35px] left-[24.8px] top-[24.8px]">
            Side-by-Side Replay
          </p>

          {/* Video Comparison */}
          <div className="absolute left-[24.8px] top-[60.6px] flex gap-[12px]">
            <div className="bg-gradient-to-b from-[#0b0e16] to-[#121626] h-[133.425px] rounded-[10px] w-[237.2px] border-[0.8px] border-[rgba(255,255,255,0.05)] relative">
              <div className="absolute inset-0 flex items-center justify-center text-[48px]">🎥</div>
              <div className="absolute bg-[rgba(0,184,219,0.1)] h-[21.587px] left-[8.8px] rounded-[8px] top-[11.6px] w-[37.638px] border-[0.8px] border-[rgba(0,184,219,0.3)]">
                <p className="font-['Arimo',_sans-serif] text-[12px] text-[#00d3f2] text-center leading-[21.587px]">You</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-[#0b0e16] to-[#121626] h-[133.425px] rounded-[10px] w-[237.2px] border-[0.8px] border-[rgba(255,255,255,0.05)] relative">
              <div className="absolute inset-0 flex items-center justify-center text-[48px]">💃</div>
              <div className="absolute bg-[rgba(173,70,255,0.1)] h-[21.587px] left-[8.8px] rounded-[8px] top-[11.6px] w-[71.375px] border-[0.8px] border-[rgba(173,70,255,0.3)]">
                <p className="font-['Arimo',_sans-serif] text-[12px] text-[#c27aff] text-center leading-[21.587px]">Reference</p>
              </div>
            </div>
          </div>

          {/* Scrubbable Timeline */}
          <div className="absolute left-[24.8px] top-[237px] w-[486.4px]">
            <div className="bg-[rgba(0,0,0,0.4)] h-[32px] rounded-[10px] relative overflow-hidden">
              {/* Color bars */}
              {beatPerformance.map((accuracy, idx) => (
                <div
                  key={idx}
                  className="absolute h-[32px] top-0"
                  style={{
                    backgroundColor: getBarColor(accuracy),
                    opacity: getBarOpacity(accuracy),
                    left: `${idx * 10.137}px`,
                    width: '10.137px'
                  }}
                />
              ))}
              
              {/* Playhead */}
              <div
                className="absolute bg-white h-[32px] top-0 w-[4px] shadow-[0px_0px_10px_0px_rgba(255,255,255,0.8)] flex flex-col items-start pb-0 pt-[10px]"
                style={{ left: `${(replayProgress / 100) * 486.4}px` }}
              >
                <div className="bg-white h-[12px] rounded-[2.68435e+07px] w-full" />
              </div>
            </div>

            <div className="flex justify-between mt-[8px]">
              <span className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282]">{replayProgress}%</span>
              <span className="font-['Arimo',_sans-serif] text-[12px] text-[#6a7282]">199s</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="absolute left-[24.8px] top-[282.21px] h-[37.6px] w-[486.4px] flex gap-[8px]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-gradient-to-r from-[#ad46ff] to-[#f6339a] h-[36px] rounded-[10px] w-[91.675px] flex items-center justify-center"
            >
              <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                <path d={svgPaths.p20913c00} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d={svgPaths.p3d4ffb00} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className="font-['Arimo',_sans-serif] text-[14px] ml-2">Pause</span>
            </button>
            
            <button className="bg-[rgba(255,255,255,0.05)] h-[37.6px] rounded-[10px] w-[143.137px] border-[0.8px] border-[rgba(255,255,255,0.1)] flex items-center justify-center">
              <span className="font-['Arimo',_sans-serif] text-[14px]">📉 Mistakes Only</span>
            </button>
          </div>
        </div>

        {/* Enter Learning Mode Button */}
        {onLearningMode && (
          <div className="absolute left-[24px] top-[1272px] w-[1096px]">
            <button
              onClick={onLearningMode}
              className="w-full bg-gradient-to-r from-[#ad46ff] via-[#f6339a] to-[#00d3f3] h-[72px] rounded-[16px] shadow-[0_0_40px_rgba(173,70,255,0.5)] flex items-center justify-center gap-[12px] hover:shadow-[0_0_60px_rgba(173,70,255,0.7)] transition-all"
            >
              <span className="text-[32px]">🎓</span>
              <span className="font-['Arimo',_sans-serif] text-[20px] text-white uppercase tracking-[1px]">Enter Learning Mode</span>
              <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="absolute left-[24px] top-[1368px] w-[1096px] flex gap-[16px] h-[40px]">
          <button
            onClick={onPracticeAgain}
            className="flex-1 bg-gradient-to-r from-[#00b8db] to-[#ad46ff] h-[40px] rounded-[8px] shadow-lg flex items-center justify-center"
          >
            <svg className="size-[16px] mr-2" fill="none" viewBox="0 0 16 16">
              <path d={svgPaths.p12949080} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d="M2 2V5.33333H5.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
            <span className="font-['Arimo',_sans-serif] text-[14px] text-white">Retry</span>
          </button>

          <button className="flex-1 bg-[rgba(38,38,38,0.3)] h-[40px] rounded-[8px] border-[0.8px] border-neutral-800 flex items-center justify-center">
            <svg className="size-[16px] mr-2" fill="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3c401780} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d={svgPaths.p56b0600} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d={svgPaths.p17caa400} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
            <span className="font-['Arimo',_sans-serif] text-[14px] text-neutral-50">Save</span>
          </button>

          <button className="flex-1 bg-[rgba(38,38,38,0.3)] h-[40px] rounded-[8px] border-[0.8px] border-neutral-800 flex items-center justify-center">
            <svg className="size-[16px] mr-2" fill="none" viewBox="0 0 16 16">
              <path d={svgPaths.p185fb780} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d={svgPaths.p30ca5e80} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d={svgPaths.pac25b80} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d="M5.72668 9.00667L10.28 11.66" stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              <path d={svgPaths.p39b18600} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
            <span className="font-['Arimo',_sans-serif] text-[14px] text-neutral-50">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
