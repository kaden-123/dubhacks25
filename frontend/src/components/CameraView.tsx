import { useEffect, useRef, useState } from 'react';
import { Skeleton as SkeletonType } from '../types';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface CameraViewProps {
  ghostOpacity: number;
  onGhostOpacityChange: (value: number) => void;
  mirrorCamera: boolean;
  onMirrorToggle: () => void;
}

export function CameraView({
  ghostOpacity,
  onGhostOpacityChange,
  mirrorCamera,
  onMirrorToggle,
}: CameraViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGhost, setShowGhost] = useState(true);

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

    const drawSkeleton = (skeleton: SkeletonType, color: string, lineWidth: number, opacity: number) => {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

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
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw camera placeholder background
      ctx.fillStyle = '#1a1a24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw "Camera Feed" text
      ctx.fillStyle = '#333344';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Camera Feed Placeholder', canvas.width / 2, canvas.height / 2);

      // Draw ghost skeleton first (behind)
      if (showGhost) {
        drawSkeleton(ghostSkeleton, '#a855f7', 6, ghostOpacity / 100);
      }

      // Draw user skeleton on top
      drawSkeleton(userSkeleton, '#06b6d4', 3, 1);

      requestAnimationFrame(animate);
    };

    animate();
  }, [ghostOpacity, showGhost]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`w-full h-full ${mirrorCamera ? 'scale-x-[-1]' : ''}`}
        />
      </div>

      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Ghost Opacity
          </Label>
          <button
            onClick={() => setShowGhost(!showGhost)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {showGhost ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showGhost ? 'Hide' : 'Show'}
          </button>
        </div>
        <Slider
          value={[ghostOpacity]}
          onValueChange={(values) => onGhostOpacityChange(values[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground text-right">{ghostOpacity}%</div>

        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="mirror-camera">Mirror Camera</Label>
          <Switch id="mirror-camera" checked={mirrorCamera} onCheckedChange={onMirrorToggle} />
        </div>
      </div>
    </div>
  );
}
