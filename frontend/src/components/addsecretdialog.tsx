import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { encryptSecret, calculatePasswordStrength, generatePasswordFeedback } from '@/utils/crypto';

interface AddSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (secret: any) => void;
}

export const AddSecretDialog = ({ open, onOpenChange, onAdd }: AddSecretDialogProps) => {
  const [name, setName] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [type, setType] = useState('password');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<string[]>([]);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleSecretChange = (value: string) => {
    setSecretValue(value);
    const strength = calculatePasswordStrength(value);
    const feedback = generatePasswordFeedback(value);
    setPasswordStrength(strength);
    setAiFeedback(feedback);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEncrypting(true);

    try {
      const encryptedData = await encryptSecret(secretValue, masterPassword);
      
      const newSecret = {
        id: Date.now().toString(),
        name,
        type,
        createdAt: new Date().toISOString().split('T')[0],
        encryptedData,
      };

      onAdd(newSecret);
      onOpenChange(false);
      
      // Reset form
      setName('');
      setSecretValue('');
      setMasterPassword('');
      setPasswordStrength(0);
      setAiFeedback([]);
    } catch (error) {
      console.error('Encryption failed:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Secret</DialogTitle>
          <DialogDescription>
            Your secret will be encrypted client-side before storage
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Secret Name</label>
            <Input
              placeholder="e.g., Production Database Password"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="password">Password</option>
              <option value="api_key">API Key</option>
              <option value="database">Database Credentials</option>
              <option value="ssh_key">SSH Key</option>
              <option value="token">Service Token</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Secret Value</label>
            <Textarea
              placeholder="Enter your secret..."
              value={secretValue}
              onChange={(e) => handleSecretChange(e.target.value)}
              className="font-mono"
              required
            />
          </div>

          {secretValue && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI Security Analysis</label>
                <span className="text-sm text-muted-foreground">
                  Strength: {passwordStrength}%
                </span>
              </div>
              <Progress value={passwordStrength} />
              
              {aiFeedback.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {aiFeedback.map((feedback, idx) => (
                        <li key={idx}>{feedback}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Master Password</label>
            <Input
              type="password"
              placeholder="Enter your master password to encrypt"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              This password will be used to derive the encryption key. Never stored on server.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEncrypting}>
              {isEncrypting ? 'Encrypting...' : '🔒 Encrypt & Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
