import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddSecretDialog } from '@/components/AddSecretDialog';
import { ViewSecretDialog } from '@/components/ViewSecretDialog';
import { PlusIcon, KeyIcon, DatabaseIcon, CloudIcon } from 'lucide-react';

interface Secret {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  encryptedData: any;
}

export const Dashboard = () => {
  const [secrets, setSecrets] = useState<Secret[]>([
    {
      id: '1',
      name: 'Database Password',
      type: 'password',
      createdAt: '2025-12-20',
      encryptedData: {},
    },
    {
      id: '2',
      name: 'AWS API Key',
      type: 'api_key',
      createdAt: '2025-12-19',
      encryptedData: {},
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);

  const handleAddSecret = (newSecret: Secret) => {
    setSecrets([...secrets, newSecret]);
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
            key={secret.id}
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
              <CardDescription>Created {secret.createdAt}</CardDescription>
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
              Start by adding your first encrypted secret
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Your First Secret
            </Button>
          </CardContent>
        </Card>
      )}

      <AddSecretDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddSecret}
      />

      <ViewSecretDialog
        secret={selectedSecret}
        onClose={() => setSelectedSecret(null)}
      />
    </div>
  );
};
