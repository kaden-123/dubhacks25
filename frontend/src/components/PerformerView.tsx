import { useEffect, useRef } from 'react';
import { Skeleton as SkeletonType } from '../types';

interface PerformerViewProps {
  ghostOpacity: number;
  mirrorCamera: boolean;
}

export function PerformerView({ ghostOpacity, mirrorCamera }: PerformerViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock skeleton data
  const userSkeleton: SkeletonType = {
    points: {
      nose: { x: 320, y: 100, confidence: 0.9 },
      leftShoulder: { x: 280, y: 150, confidence: 0.85 },
      rightShoulder: { x: 360, y: 150, confidence: 0.85 },
      leftElbow: { x: 250, y: 220, confidence: 0.8 },
      rightElbow: { x: 390, y: 220, confidence: 0.8 },
      leftWrist: { x: 240, y: 280, confidence: 0.75 },
      rightWrist: { x: 400, y: 280, confidence: 0.75 },
      leftHip: { x: 290, y: 280, confidence: 0.9 },
      rightHip: { x: 350, y: 280, confidence: 0.9 },
      leftKnee: { x: 285, y: 360, confidence: 0.85 },
      rightKnee: { x: 355, y: 360, confidence: 0.85 },
      leftAnkle: { x: 280, y: 440, confidence: 0.8 },
      rightAnkle: { x: 360, y: 440, confidence: 0.8 },
    },
  };

  const ghostSkeleton: SkeletonType = {
    points: {
      nose: { x: 320, y: 110, confidence: 1 },
      leftShoulder: { x: 275, y: 160, confidence: 1 },
      rightShoulder: { x: 365, y: 160, confidence: 1 },
      leftElbow: { x: 245, y: 230, confidence: 1 },
      rightElbow: { x: 395, y: 230, confidence: 1 },
      leftWrist: { x: 230, y: 290, confidence: 1 },
      rightWrist: { x: 410, y: 290, confidence: 1 },
      leftHip: { x: 290, y: 285, confidence: 1 },
      rightHip: { x: 350, y: 285, confidence: 1 },
      leftKnee: { x: 285, y: 365, confidence: 1 },
      rightKnee: { x: 355, y: 365, confidence: 1 },
      leftAnkle: { x: 280, y: 445, confidence: 1 },
      rightAnkle: { x: 360, y: 445, confidence: 1 },
    },
  };

  const connections = [
    ['nose', 'leftShoulder'],
    ['nose', 'rightShoulder'],
    ['leftShoulder', 'rightShoulder'],
    ['leftShoulder', 'leftElbow'],
    ['leftElbow', 'leftWrist'],
    ['rightShoulder', 'rightElbow'],
    ['rightElbow', 'rightWrist'],
    ['leftShoulder', 'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip', 'rightHip'],
    ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'],
    ['rightHip', 'rightKnee'],
    ['rightKnee', 'rightAnkle'],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeleton = (skeleton: SkeletonType, color: string, lineWidth: number, opacity: number, glow: boolean = false) => {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      if (glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }

      connections.forEach(([joint1, joint2]) => {
        const p1 = skeleton.points[joint1];
        const p2 = skeleton.points[joint2];
        if (p1 && p2 && p1.confidence > 0.5 && p2.confidence > 0.5) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw joints
      Object.values(skeleton.points).forEach((point) => {
        if (point.confidence > 0.5) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, lineWidth * 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0B0E16');
      gradient.addColorStop(1, '#121626');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw "Camera Calibrating" text
      ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Camera Calibrating...', canvas.width / 2, canvas.height / 2 - 100);

      // Draw ghost skeleton first (behind) with purple glow
      drawSkeleton(ghostSkeleton, '#a855f7', 4, ghostOpacity / 100, true);

      // Draw user skeleton on top with cyan glow
      drawSkeleton(userSkeleton, '#22d3ee', 3, 1, true);

      requestAnimationFrame(animate);
    };

    animate();
  }, [ghostOpacity]);

  return (
    <div className="h-full bg-gradient-to-br from-[#0B0E16] to-[#121626] rounded-lg overflow-hidden border border-white/5 relative">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className={`w-full h-full ${mirrorCamera ? 'scale-x-[-1]' : ''}`}
      />
      
      {/* Label overlay */}
      <div className="absolute top-4 left-4 text-xs text-gray-500 uppercase tracking-wider">
        Performer
      </div>
    </div>
  );
}
