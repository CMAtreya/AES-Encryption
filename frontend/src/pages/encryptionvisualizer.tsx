import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, PauseIcon, SkipForwardIcon } from 'lucide-react';

export const EncryptionVisualizer = () => {
  const [plaintext, setPlaintext] = useState('Hello SecureVault');
  const [masterPassword, setMasterPassword] = useState('MyMasterPass123!');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      name: 'Plaintext Input',
      description: 'Original secret data in readable form',
      data: plaintext,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: 'Generate Salt',
      description: 'Random 128-bit salt for key derivation',
      data: 'a3f9c2e8b1d4...',
      color: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      name: 'PBKDF2 Key Derivation',
      description: '100,000 iterations of SHA-256',
      data: 'Deriving 256-bit key...',
      color: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Generate IV',
      description: 'Random 96-bit initialization vector',
      data: 'e7b2a9f1c4d8...',
      color: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      name: 'AES-256-GCM Encryption',
      description: 'Symmetric encryption with authentication',
      data: 'Encrypting blocks...',
      color: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      name: 'Ciphertext + Auth Tag',
      description: 'Encrypted data with integrity verification',
      data: '8f3a9c2e1b7d...',
      color: 'bg-red-100 dark:bg-red-900',
    },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Encryption Visualizer</h2>
        <p className="text-muted-foreground">
          Watch how your data is encrypted step-by-step
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Data to encrypt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plaintext</label>
              <Input
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter text to encrypt"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Master Password</label>
              <Input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Master password"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Control the visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handlePlay} disabled={isPlaying}>
                <PlayIcon className="w-4 h-4 mr-2" />
                Play
              </Button>
              <Button onClick={handleNext} variant="outline" disabled={currentStep >= steps.length - 1}>
                <SkipForwardIcon className="w-4 h-4 mr-2" />
                Next Step
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <Card
            key={idx}
            className={`transition-all duration-500 ${
              idx === currentStep ? 'ring-2 ring-primary scale-105 encryption-step active' : 'opacity-50'
            } ${idx < currentStep ? 'opacity-75' : ''} encryption-step`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={idx <= currentStep ? 'default' : 'secondary'}>
                  Step {idx + 1}
                </Badge>
                {idx === currentStep && <span className="text-lg">🔄</span>}
                {idx < currentStep && <span className="text-lg">✅</span>}
              </div>
              <CardTitle className="text-lg">{step.name}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-3 rounded-md font-mono text-sm ${step.color}`}>
                {step.data}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cryptographic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Algorithm</p>
            <p className="text-muted-foreground">AES-256-GCM</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Key Derivation</p>
            <p className="text-muted-foreground">PBKDF2-SHA256</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Iterations</p>
            <p className="text-muted-foreground">100,000</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
