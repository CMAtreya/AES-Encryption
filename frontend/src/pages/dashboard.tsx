import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddSecretDialog } from '@/components/AddSecretDialog';
import { ViewSecretDialog } from '@/components/ViewSecretDialog';
import { PlusIcon, KeyIcon, DatabaseIcon, CloudIcon, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Secret {
  _id: string;
  name: string;
  type: string;
  createdAt: string;
  encryptedData: any;
}

export const Dashboard = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);

  const fetchSecrets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/secrets');
      setSecrets(response.data.data.secrets);
    } catch (err) {
      setError('Failed to load secrets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  const handleAddSecret = async (newSecretData: any) => {
    try {
      // API call to create secret
      // The newSecretData comes from AddSecretDialog and contains name, type, encryptedData
      const response = await api.post('/secrets', {
        name: newSecretData.name,
        type: newSecretData.type,
        encryptedData: newSecretData.encryptedData
      });

      // Add the returned secret to the list
      setSecrets([response.data.data.secret, ...secrets]);
    } catch (err) {
      console.error('Failed to add secret:', err);
      // Ideally show a toast here
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password':
        return <KeyIcon className="w-4 h-4" />;
      case 'api_key':
        return <CloudIcon className="w-4 h-4" />;
      case 'database':
        return <DatabaseIcon className="w-4 h-4" />;
      default:
        return <KeyIcon className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
        <Button onClick={fetchSecrets} variant="outline" className="ml-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Secrets</h2>
          <p className="text-muted-foreground">
            Manage your encrypted credentials securely
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Secret
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {secrets.map((secret) => (
          <Card
            key={secret._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedSecret(secret)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(secret.type)}
                  <CardTitle className="text-lg">{secret.name}</CardTitle>
                </div>
                <Badge variant="secondary">{secret.type}</Badge>
              </div>
              <CardDescription>Created {new Date(secret.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                🔒 Encrypted with AES-256-GCM
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {secrets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <KeyIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No secrets yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first encrypted secret to get started
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Secret
            </Button>
          </CardContent>
        </Card>
      )}

      <AddSecretDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddSecret}
      />

      {/* ViewSecretDialog needs to be implemented/checked if it accepts the secret object structure */}
      {selectedSecret && (
        <ViewSecretDialog
          open={!!selectedSecret}
          onOpenChange={(open) => !open && setSelectedSecret(null)}
          secret={selectedSecret}
        />
      )}
    </div>
  );
};
