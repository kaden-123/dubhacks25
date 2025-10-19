import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle2, Circle, User, Camera, AlertCircle, RotateCcw } from 'lucide-react';

interface CalibrationPageProps {
  onComplete: () => void;
  onBack: () => void;
}

export function CalibrationPage({ onComplete, onBack }: CalibrationPageProps) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [mirrorCamera, setMirrorCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const checklistItems = [
    { id: 1, label: 'Stand 6-8 feet back from camera', completed: false },
    { id: 2, label: 'Full body visible in frame', completed: false },
    { id: 3, label: 'Good lighting (no backlight)', completed: false },
    { id: 4, label: 'Clear background space', completed: false },
  ];

  const [checklist, setChecklist] = useState(checklistItems);

  // Initialize webcam
  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        setDebugInfo('Requesting camera access...');
        console.log('Requesting camera access...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        
        console.log('Camera stream obtained:', stream);
        setDebugInfo('Stream obtained, waiting for video element...');
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        
        // Wait for video element to be available
        const waitForVideoElement = () => {
          return new Promise<HTMLVideoElement>((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            
            const checkVideo = () => {
              attempts++;
              if (videoRef.current) {
                console.log('Video element found!');
                setDebugInfo('Video element found, setting up...');
                resolve(videoRef.current);
              } else if (attempts >= maxAttempts) {
                reject(new Error('Video element not found after waiting'));
              } else {
                setTimeout(checkVideo, 100);
              }
            };
            
            checkVideo();
          });
        };

        try {
          const videoElement = await waitForVideoElement();
          
          console.log('Setting video srcObject...');
          videoElement.srcObject = stream;
          
          // Add event listeners for debugging
          videoElement.onloadstart = () => {
            console.log('Video load started');
            setDebugInfo('Video loading...');
          };
          
          videoElement.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            setDebugInfo('Metadata loaded, playing...');
          };
          
          videoElement.oncanplay = () => {
            console.log('Video can play');
            setDebugInfo('Video ready to play');
          };
          
          videoElement.onplaying = () => {
            console.log('Video is playing');
            setDebugInfo('Video playing successfully');
            if (mounted) {
              setCameraReady(true);
            }
          };
          
          videoElement.onerror = (e) => {
            console.error('Video error:', e);
            setDebugInfo('Video error occurred');
            if (mounted) {
              setCameraError('Failed to display camera feed.');
            }
          };
          
          // Try to play immediately
          try {
            console.log('Attempting to play video...');
            await videoElement.play();
            console.log('Video playing successfully');
            if (mounted) {
              setCameraReady(true);
            }
          } catch (playError) {
            console.error('Error playing video:', playError);
            setDebugInfo('Play error, waiting for metadata...');
          }
        } catch (videoError) {
          console.error('Video element error:', videoError);
          setDebugInfo('Video element not found');
          if (mounted) {
            setCameraError('Failed to initialize video element.');
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        if (!mounted) return;
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            setCameraError('Camera access denied. Please allow camera permissions.');
          } else if (error.name === 'NotFoundError') {
            setCameraError('No camera found. Please connect a camera.');
          } else {
            setCameraError('Failed to access camera. Please check your device.');
          }
        }
        setDebugInfo('Camera access failed');
      }
    };

    // Small delay to ensure component is fully rendered
    const timer = setTimeout(() => {
      initCamera();
    }, 100);

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    
    // Simulate calibration process
    setTimeout(() => {
      const updatedChecklist = checklist.map(item => ({ ...item, completed: true }));
      setChecklist(updatedChecklist);
      setIsCalibrating(false);
      setIsComplete(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-auto">
      <div className="max-w-4xl w-full space-y-8 my-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] bg-clip-text text-transparent">
            Camera Calibration
          </h1>
          <p className="text-muted-foreground">
            Let's set up your camera for the best tracking experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Camera Preview */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <h3>Camera Preview</h3>
              
              {/* Live Camera Feed */}
              <div className="relative aspect-[3/4] bg-black rounded-lg border border-border overflow-hidden">
                {/* Video element - always present */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full ${cameraReady ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    transform: mirrorCamera ? 'scaleX(-1)' : 'scaleX(1)',
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
                
                
                {/* Overlay states */}
                {cameraError ? (
                  // Error State
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/80">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <p className="text-sm text-red-400 text-center">{cameraError}</p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Check browser settings and reload the page
                    </p>
                  </div>
                ) : !cameraReady ? (
                  // Loading State
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                    <Camera className="w-16 h-16 text-purple-500 mb-4 animate-pulse" />
                    <p className="text-sm text-muted-foreground">Activating camera...</p>
                  </div>
                ) : null}
              </div>

              <div className="text-xs text-center text-muted-foreground space-y-3">
                {cameraReady ? (
                  <>
                    <div>
                      <span className="inline-flex items-center gap-1 text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Camera Active
                      </span>
                      <span className="mx-2">•</span>
                      Align yourself within the frame
                    </div>
                    
                    {/* Mirror Camera Button */}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMirrorCamera(!mirrorCamera)}
                        className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/20"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {mirrorCamera ? 'Unmirror Camera' : 'Mirror Camera'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div>Waiting for camera access...</div>
                    {debugInfo && (
                      <div className="text-xs text-blue-400">
                        Debug: {debugInfo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Right: Checklist */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="mb-4">Setup Checklist</h3>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      item.completed
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-muted/20'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
              <h4 className="mb-2 text-blue-300">💡 Pro Tips</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Wear fitted clothing for better tracking</li>
                <li>• Avoid busy patterns or reflective materials</li>
                <li>• Clear the area around you for full movement</li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isComplete ? (
                <Button
                  size="lg"
                  onClick={handleCalibrate}
                  disabled={isCalibrating}
                  className="w-full bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90"
                >
                  {isCalibrating ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                      Calibrating...
                    </>
                  ) : (
                    'Start Calibration'
                  )}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={onComplete}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Begin Practice
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="w-full border-border"
              >
                Back to Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
