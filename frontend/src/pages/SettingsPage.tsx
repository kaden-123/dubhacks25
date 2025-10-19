import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Settings as SettingsType } from '../types';
import { defaultSettings } from '../data/mockData';
import { ArrowLeft, Video, Eye, Palette, MessageSquare, Keyboard } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play / Pause' },
    { key: 'R', action: 'Restart' },
    { key: 'M', action: 'Toggle Mirror' },
    { key: 'S', action: 'Toggle Skeleton' },
    { key: '←/→', action: 'Seek backward/forward' },
    { key: '[/]', action: 'Decrease/Increase speed' },
    { key: 'C', action: 'Recalibrate' },
    { key: 'Esc', action: 'Exit practice' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1>Settings</h1>
            <p className="text-muted-foreground">Customize your practice experience</p>
          </div>
        </div>

        {/* Video Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="mb-6 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Settings
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resolution">Video Resolution</Label>
              <Select
                value={settings.videoResolution}
                onValueChange={(value: '720p' | '1080p' | '480p') =>
                  setSettings({ ...settings, videoResolution: value })
                }
              >
                <SelectTrigger id="resolution" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p (Lower quality, better performance)</SelectItem>
                  <SelectItem value="720p">720p (Recommended)</SelectItem>
                  <SelectItem value="1080p">1080p (Highest quality)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher resolutions may impact performance on slower devices
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="mirror">Mirror Camera by Default</Label>
                <p className="text-xs text-muted-foreground">Flip camera horizontally for easier learning</p>
              </div>
              <Switch
                id="mirror"
                checked={settings.mirrorCamera}
                onCheckedChange={(checked) => setSettings({ ...settings, mirrorCamera: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Display Settings
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Default Ghost Opacity</Label>
                <span className="text-sm text-muted-foreground">{settings.ghostOpacity}%</span>
              </div>
              <Slider
                value={[settings.ghostOpacity]}
                onValueChange={(values) => setSettings({ ...settings, ghostOpacity: values[0] })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How visible the reference ghost skeleton should be
              </p>
            </div>
          </div>
        </Card>

        {/* Accessibility */}
        <Card className="p-6 bg-card border-border">
          <h3 className="mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Accessibility
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="colorblind">Color-Blind Safe Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Use patterns and symbols in addition to colors
                </p>
              </div>
              <Switch
                id="colorblind"
                checked={settings.colorBlindMode}
                onCheckedChange={(checked) => setSettings({ ...settings, colorBlindMode: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Feedback Settings */}
        <Card className="p-6 bg-card border-border">
          <h3 className="mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Feedback & Coaching
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verbosity">Feedback Verbosity</Label>
              <Select
                value={settings.feedbackVerbosity}
                onValueChange={(value: 'Basic' | 'Advanced') =>
                  setSettings({ ...settings, feedbackVerbosity: value })
                }
              >
                <SelectTrigger id="verbosity" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic (Simple tips)</SelectItem>
                  <SelectItem value="Advanced">Advanced (Detailed metrics & angles)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {settings.feedbackVerbosity === 'Basic'
                  ? 'Shows simple, easy-to-understand coaching tips'
                  : 'Shows detailed metrics including angles, timing in milliseconds, etc.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="p-6 bg-card border-border">
          <h3 className="mb-6 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {keyboardShortcuts.map((shortcut, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border"
              >
                <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                <Badge variant="outline" className="border-[var(--neon-purple)] text-[var(--neon-purple)] font-mono">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={() => {
              alert('Settings saved!');
              onBack();
            }}
            className="flex-1 bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90"
          >
            Save Settings
          </Button>
          <Button size="lg" variant="outline" onClick={onBack} className="flex-1 border-border">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
