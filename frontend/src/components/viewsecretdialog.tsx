import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { decryptSecret } from '@/utils/crypto';
import { CopyIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface ViewSecretDialogProps {
  secret: any;
  onClose: () => void;
}

export const ViewSecretDialog = ({ secret, onClose }: ViewSecretDialogProps) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [decryptedValue, setDecryptedValue] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setError('');

    try {
      const plaintext = await decryptSecret(secret.encryptedData, masterPassword);
      setDecryptedValue(plaintext);
    } catch (err) {
      setError('Decryption failed. Check your master password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decryptedValue);
    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 30000); // Auto-clear after 30 seconds
  };

  if (!secret) return null;

  return (
    <Dialog open={!!secret} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{secret.name}</DialogTitle>
          <DialogDescription>
            Enter your master password to decrypt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!decryptedValue ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Master Password</label>
                <Input
                  type="password"
                  placeholder="Enter master password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDecrypt()}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleDecrypt} className="w-full" disabled={isDecrypting}>
                {isDecrypting ? 'Decrypting...' : '🔓 Decrypt Secret'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Decrypted Value</label>
                <div className="relative">
                  <Input
                    type={showSecret ? 'text' : 'password'}
                    value={decryptedValue}
                    readOnly
                    className="pr-20 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCopy}>
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⏱️ Clipboard will auto-clear in 30 seconds
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
